import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    coins = Column(Integer, default=100)
    guild_rank = Column(String, default="Bronze I")
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    posted_quests = relationship("Quest", foreign_keys="Quest.poster_id", back_populates="poster")
    accepted_quests = relationship("Quest", foreign_keys="Quest.hunter_id", back_populates="hunter")

class VerificationToken(Base):
    __tablename__ = "verification_tokens"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    email = Column(String, index=True, nullable=False)
    otp_code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Quest(Base):
    __tablename__ = "quests"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    location_zone = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    reward_type = Column(String, nullable=False)
    reward_amount = Column(Integer, nullable=False)
    urgency = Column(String, nullable=False)
    time_limit_str = Column(String, nullable=False)
    status = Column(String, default="Open")  # 'Open', 'In Progress', 'Submitted', 'Verified & Released'
    
    poster_id = Column(String, ForeignKey("users.id"), nullable=False)
    hunter_id = Column(String, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    poster = relationship("User", foreign_keys=[poster_id], back_populates="posted_quests")
    hunter = relationship("User", foreign_keys=[hunter_id], back_populates="accepted_quests")
