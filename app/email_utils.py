import smtplib
from email.message import EmailMessage

from app.config import settings


def send_verification_email(to_email: str, verify_url: str) -> bool:
    if not all([settings.smtp_host, settings.smtp_username, settings.smtp_password, settings.smtp_from_email]):
        print(f"[AUTH] Verification URL for {to_email}: {verify_url}")
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

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        if settings.smtp_use_tls:
            server.starttls()
        server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(msg)

    return True
