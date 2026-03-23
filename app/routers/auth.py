from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.email_utils import send_verification_email
from app.models import User
from app.schemas import (
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResendVerificationRequest,
    TokenResponse,
    UserResponse,
)
from app.security import (
    create_access_token,
    decode_access_token,
    generate_verification_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    token = generate_verification_token()
    user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        is_verified=False,
        verification_token=token,
        verification_sent_at=datetime.utcnow(),
    )
    db.add(user)
    await db.commit()

    verify_url = f"{settings.public_api_base_url}/auth/verify-email?token={token}"
    sent, channel = send_verification_email(user.email, verify_url)

    mode = f"email sent via {channel}" if sent else f"email not sent (fallback ativo; motivo: {channel})"
    return MessageResponse(message=f"User created. Verification pending ({mode}).")


@router.get("/verify-email", response_model=MessageResponse)
async def verify_email(token: str = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.verification_token == token))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user.is_verified = True
    user.verification_token = None
    await db.commit()

    return MessageResponse(message="Email verified successfully")


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(payload: ResendVerificationRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return MessageResponse(message="User already verified")

    token = generate_verification_token()
    user.verification_token = token
    user.verification_sent_at = datetime.utcnow()
    await db.commit()

    verify_url = f"{settings.public_api_base_url}/auth/verify-email?token={token}"
    sent, channel = send_verification_email(user.email, verify_url)
    mode = f"email sent via {channel}" if sent else f"email not sent (fallback ativo; motivo: {channel})"
    return MessageResponse(message=f"Verification resent ({mode}).")


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    user = result.scalars().first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    subject = decode_access_token(credentials.credentials)
    if not subject:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    result = await db.execute(select(User).where(User.email == subject))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def _create_discord_state(next_path: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=10)
    payload = {
        "kind": "discord_oauth_state",
        "next": next_path,
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def _decode_discord_state(state: str) -> str | None:
    try:
        payload = jwt.decode(state, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None

    if payload.get("kind") != "discord_oauth_state":
        return None

    next_path = payload.get("next")
    if not isinstance(next_path, str) or not next_path.startswith("/"):
        return None

    return next_path


def _build_frontend_redirect(next_path: str, fragment_params: dict[str, str]) -> str:
    base = settings.frontend_base_url.rstrip("/")
    path = next_path if next_path.startswith("/") else "/central.html"
    return f"{base}{path}#{urlencode(fragment_params)}"


@router.get("/discord/login")
async def discord_login(next: str = Query("/central.html")):
    if not settings.discord_client_id or not settings.discord_redirect_uri:
        raise HTTPException(status_code=503, detail="Discord OAuth not configured")

    next_path = next if next.startswith("/") else "/central.html"
    state = _create_discord_state(next_path)

    params = {
        "client_id": settings.discord_client_id,
        "response_type": "code",
        "redirect_uri": settings.discord_redirect_uri,
        "scope": settings.discord_oauth_scope,
        "state": state,
        "prompt": "none",
    }
    auth_url = f"https://discord.com/oauth2/authorize?{urlencode(params)}"
    return RedirectResponse(url=auth_url, status_code=302)


@router.get("/discord/callback")
async def discord_callback(
    code: str | None = Query(None),
    state: str | None = Query(None),
    error: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    if error:
        fail_url = _build_frontend_redirect("/central.html", {"auth_error": "oauth_cancelled"})
        return RedirectResponse(url=fail_url, status_code=302)

    if not code or not state:
        fail_url = _build_frontend_redirect("/central.html", {"auth_error": "missing_oauth_data"})
        return RedirectResponse(url=fail_url, status_code=302)

    if not settings.discord_client_id or not settings.discord_client_secret or not settings.discord_redirect_uri:
        raise HTTPException(status_code=503, detail="Discord OAuth not configured")

    next_path = _decode_discord_state(state)
    if not next_path:
        fail_url = _build_frontend_redirect("/central.html", {"auth_error": "invalid_oauth_state"})
        return RedirectResponse(url=fail_url, status_code=302)

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            token_res = await client.post(
                "https://discord.com/api/oauth2/token",
                data={
                    "client_id": settings.discord_client_id,
                    "client_secret": settings.discord_client_secret,
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": settings.discord_redirect_uri,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if token_res.status_code != 200:
                fail_url = _build_frontend_redirect(next_path, {"auth_error": "token_exchange_failed"})
                return RedirectResponse(url=fail_url, status_code=302)

            token_data = token_res.json()
            access_token = token_data.get("access_token")
            if not access_token:
                fail_url = _build_frontend_redirect(next_path, {"auth_error": "missing_access_token"})
                return RedirectResponse(url=fail_url, status_code=302)

            user_res = await client.get(
                "https://discord.com/api/users/@me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if user_res.status_code != 200:
                fail_url = _build_frontend_redirect(next_path, {"auth_error": "profile_fetch_failed"})
                return RedirectResponse(url=fail_url, status_code=302)

            profile = user_res.json()
    except Exception:
        fail_url = _build_frontend_redirect(next_path, {"auth_error": "discord_network_error"})
        return RedirectResponse(url=fail_url, status_code=302)

    discord_id = str(profile.get("id") or "").strip()
    if not discord_id:
        fail_url = _build_frontend_redirect(next_path, {"auth_error": "invalid_discord_profile"})
        return RedirectResponse(url=fail_url, status_code=302)

    email = f"discord_{discord_id}@discord.local"
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        user = User(
            email=email,
            hashed_password=hash_password(generate_verification_token()),
            is_verified=True,
            verification_token=None,
            verification_sent_at=None,
        )
        db.add(user)
        await db.commit()
    elif not user.is_verified:
        user.is_verified = True
        user.verification_token = None
        await db.commit()

    app_token = create_access_token(subject=user.email)
    ok_url = _build_frontend_redirect(next_path, {"auth_token": app_token, "provider": "discord"})
    return RedirectResponse(url=ok_url, status_code=302)
