from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "ReWearth <noreply@rewearth.app>"

    class Config:
        env_file = ".env"

settings = Settings()
