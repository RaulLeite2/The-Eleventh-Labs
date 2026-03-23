# auththeabyss

Python auth API for The Abyss projects.

## Stack

- FastAPI
- SQLite (local default) or any SQLAlchemy-compatible DB
- JWT auth
- Email verification token flow

## Features

- Register with email/password
- Login and receive bearer token (only after email verification)
- Get current user with token
- Email verification endpoint
- Resend verification endpoint
- SMTP support (optional)

## Quick start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8001
```

Health check:

```bash
GET http://127.0.0.1:8001/health
```

Swagger docs:

```bash
http://127.0.0.1:8001/docs
```

## Main routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (Bearer token)
- `GET /auth/verify-email?token=...`
- `POST /auth/resend-verification`

## Email verification behavior

- Provider can be configured with `EMAIL_PROVIDER=auto|resend|smtp`.
- `auto` tries Resend first (HTTPS), then SMTP fallback.
- If no provider succeeds, verification link is printed in backend logs.

This fallback is useful while developing locally.

## Railway production variables

Set at least these values in Railway:

- `PUBLIC_API_BASE_URL=https://theabyssauth.up.railway.app`
- `FRONTEND_BASE_URL=https://theelevenlabs.up.railway.app`
- `EMAIL_PROVIDER=resend`
- `RESEND_API_KEY=...`
- `RESEND_FROM_EMAIL=...`

Optional SMTP fallback values:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_USE_TLS`
