from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "The Abyss Auth API"
    env: str = "development"
    debug: bool = True

    secret_key: str = "change-this-secret-key"
    access_token_expire_minutes: int = 60
    algorithm: str = "HS256"

    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/authdb"
    frontend_base_url: str = "http://localhost:5500"
    public_api_base_url: str = "http://localhost:8000"

    discord_client_id: str | None = None
    discord_client_secret: str | None = None
    discord_redirect_uri: str | None = None
    discord_oauth_scope: str = "identify email"

    email_provider: str = "auto"

    resend_api_key: str | None = None
    resend_from_email: str | None = None

    sendgrid_api_key: str | None = None
    sendgrid_from_email: str | None = None

    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_use_tls: bool = True

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    @field_validator("database_url", mode="before")
    @classmethod
    def force_asyncpg_driver(cls, v: str) -> str:
        # Railway provides postgresql:// or postgres:// — rewrite to asyncpg dialect
        if v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql+asyncpg://", 1)
        elif v.startswith("postgresql://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    @field_validator("smtp_password", mode="before")
    @classmethod
    def normalize_smtp_password(cls, v: str | None) -> str | None:
        if v is None:
            return None
        # Gmail app password is often copied with spaces (xxxx xxxx xxxx xxxx).
        # Normalize so both formats work.
        return v.replace(" ", "").strip() or None

    @field_validator("email_provider", mode="before")
    @classmethod
    def normalize_email_provider(cls, v: str | None) -> str:
        provider = (v or "auto").strip().lower()
        if provider not in {"auto", "smtp", "resend", "sendgrid"}:
            return "auto"
        return provider


settings = Settings()
