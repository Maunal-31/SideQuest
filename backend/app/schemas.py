from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, example="Alex Hunter")
    email: EmailStr = Field(..., example="alex@campus.edu")
    password: str = Field(..., min_length=6, example="Secret123!")

class VerifyEmail(BaseModel):
    email: EmailStr = Field(..., example="alex@campus.edu")
    otp_code: str = Field(..., min_length=6, max_length=6, example="849201")

class ResendOTP(BaseModel):
    email: EmailStr = Field(..., example="alex@campus.edu")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="alex@campus.edu")
    password: str = Field(..., example="Secret123!")

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    is_verified: bool
    level: int
    xp: int
    coins: int
    guild_rank: str
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Quest Schemas ---
class QuestCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(...)
    category: str = Field(...)
    locationZone: str = Field(...)
    lat: float = Field(...)
    lng: float = Field(...)
    rewardType: str = Field(...)
    rewardAmount: int = Field(..., gt=0)
    urgency: str = Field(...)  # 'Low', 'Medium', 'High', 'Critical'
    timeLimitStr: str = Field(...)

class QuestResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    locationZone: str
    lat: float
    lng: float
    rewardType: str
    rewardAmount: int
    urgency: str
    timeLimitStr: str
    status: str
    posterName: str
    posterLevel: int
    createdAt: datetime
    hunterName: Optional[str] = None

    class Config:
        from_attributes = True
