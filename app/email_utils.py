import json
import smtplib
from email.message import EmailMessage
from urllib import error, request

from app.config import settings


def _send_with_resend(to_email: str, verify_url: str) -> tuple[bool, str]:
    if not settings.resend_api_key or not settings.resend_from_email:
        return False, "resend_not_configured"

    payload = {
        "from": settings.resend_from_email,
        "to": [to_email],
        "subject": "Verify your email - The Abyss Auth",
        "text": (
            "Welcome to The Abyss Auth.\n\n"
            f"Click this link to verify your email:\n{verify_url}\n\n"
            "If you did not request this, you can ignore this email."
        ),
        "html": (
            "<p>Welcome to The Abyss Auth.</p>"
            f"<p>Click this link to verify your email:<br><a href=\"{verify_url}\">{verify_url}</a></p>"
            "<p>If you did not request this, you can ignore this email.</p>"
        ),
    }

    req = request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=20) as response:
            if 200 <= response.status < 300:
                print(f"[AUTH][EMAIL_SENT][RESEND] Verification email sent to {to_email}")
                return True, "resend"
            return False, f"resend_http_{response.status}"
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        print(f"[AUTH][EMAIL_ERROR][RESEND] HTTP {exc.code}: {body}")
        return False, f"resend_http_{exc.code}"
    except Exception as exc:
        print(f"[AUTH][EMAIL_ERROR][RESEND] {exc.__class__.__name__}: {exc}")
        return False, "resend_network_error"


def _send_with_smtp(to_email: str, verify_url: str) -> tuple[bool, str]:
    if not all([settings.smtp_host, settings.smtp_username, settings.smtp_password, settings.smtp_from_email]):
        return False, "smtp_not_configured"

    msg = EmailMessage()
    msg["Subject"] = "Verify your email - The Abyss Auth"
    msg["From"] = settings.smtp_from_email
    msg["To"] = to_email
    msg.set_content(
        "Welcome to The Abyss Auth.\n\n"
        f"Click this link to verify your email:\n{verify_url}\n\n"
        "If you did not request this, you can ignore this email."
    )

    try:
        if settings.smtp_port == 465:
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=20) as server:
                server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
                if settings.smtp_use_tls:
                    server.starttls()
                server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(msg)
        print(f"[AUTH][EMAIL_SENT][SMTP] Verification email sent to {to_email}")
        return True, "smtp"
    except Exception as exc:
        print(f"[AUTH][EMAIL_ERROR][SMTP] Could not send verification email to {to_email}: {exc.__class__.__name__}: {exc}")
        return False, "smtp_network_error"


def send_verification_email(to_email: str, verify_url: str) -> tuple[bool, str]:
    # auto: try Resend first (HTTPS/443), then SMTP.
    provider = settings.email_provider

    if provider in {"auto", "resend"}:
        sent, mode = _send_with_resend(to_email, verify_url)
        if sent:
            return True, mode
        if provider == "resend":
            print(f"[AUTH][EMAIL_FALLBACK] Verification URL for {to_email}: {verify_url}")
            return False, mode

    if provider in {"auto", "smtp"}:
        sent, mode = _send_with_smtp(to_email, verify_url)
        if sent:
            return True, mode
        print(f"[AUTH][EMAIL_FALLBACK] Verification URL for {to_email}: {verify_url}")
        return False, mode

    print(f"[AUTH][EMAIL_FALLBACK] Unknown provider. Verification URL for {to_email}: {verify_url}")
    return False, "invalid_provider"
