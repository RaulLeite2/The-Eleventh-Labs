import smtplib
from email.message import EmailMessage

from app.config import settings


def send_verification_email(to_email: str, verify_url: str) -> bool:
    if not all([settings.smtp_host, settings.smtp_username, settings.smtp_password, settings.smtp_from_email]):
        print(f"[AUTH][EMAIL_FALLBACK] SMTP not configured. Verification URL for {to_email}: {verify_url}")
        return False

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
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            if settings.smtp_use_tls:
                server.starttls()
            server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(msg)
        print(f"[AUTH][EMAIL_SENT] Verification email sent to {to_email}")
        return True
    except Exception as exc:
        print(f"[AUTH][EMAIL_ERROR] Could not send verification email to {to_email}: {exc.__class__.__name__}: {exc}")
        print(f"[AUTH][EMAIL_FALLBACK] Verification URL for {to_email}: {verify_url}")
        return False
