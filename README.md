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

- If SMTP is configured in `.env`, verification email is sent.
- If SMTP is not configured, verification link is printed in backend logs.

This fallback is useful while developing locally.
