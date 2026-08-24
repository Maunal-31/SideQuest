import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SideQuest API"
    API_V1_STR: str = "/api/v1"
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-sidequest-campus-key-2026-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Campus Email Verification
    OTP_EXPIRE_MINUTES: int = 15
    ALLOWED_CAMPUS_DOMAINS: list[str] = [".edu", "ac.in", "university.edu", "campus.edu", "gmail.com"] # Add campus domains or set empty for any
    REQUIRE_CAMPUS_DOMAIN: bool = False  # Set to True to strictly enforce .edu / campus domain check
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sidequest.db")
    
    # Email / SMTP Settings (Optional - falls back to console logging if empty)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "noreply@sidequest.campus")
    EMAILS_FROM_NAME: str = "SideQuest Campus"

    class Config:
        case_sensitive = True

settings = Settings()
