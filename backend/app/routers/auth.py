from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User, VerificationToken
from app.schemas import UserRegister, VerifyEmail, ResendOTP, UserLogin, Token, UserResponse
from app.utils.auth import hash_password, verify_password, validate_campus_email, create_access_token, get_current_user
from app.utils.email import generate_otp, send_verification_otp

router = APIRouter(prefix="/auth", tags=["Authentication & Email Verification"])

@router.post("/register", status_code=status.HTTP_210_CREATED if hasattr(status, "HTTP_210_CREATED") else 201)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Step 1: Register user with campus email.
    Saves user with is_verified=False and sends a 6-digit OTP code to their campus email.
    """
    # 1. Validate Campus Email Domain
    if not validate_campus_email(user_in.email):
        allowed = ", ".join(settings.ALLOWED_CAMPUS_DOMAINS)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration requires a valid campus email address (allowed domains: {allowed})."
        )
    
    # 2. Check if user exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        if existing_user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this campus email already exists."
            )
        else:
            # Re-send verification OTP for unverified existing user
            otp_code = generate_otp()
            expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
            
            token = VerificationToken(
                user_id=existing_user.id,
                email=existing_user.email,
                otp_code=otp_code,
                expires_at=expires_at
            )
            db.add(token)
            db.commit()
            
            send_verification_otp(existing_user.email, otp_code)
            return {
                "message": "Unverified user found. A new verification OTP code has been sent to your email.",
                "email": existing_user.email,
                "is_verified": False
            }

    # 3. Create new user
    avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_in.name.replace(' ', '')}"
    new_user = User(
        email=user_in.email.lower().strip(),
        hashed_password=hash_password(user_in.password),
        name=user_in.name,
        avatar=avatar_url,
        is_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 4. Generate & save 6-digit OTP token
    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    token_record = VerificationToken(
        user_id=new_user.id,
        email=new_user.email,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.add(token_record)
    db.commit()

    # 5. Send Email OTP
    send_verification_otp(new_user.email, otp_code)

    return {
        "message": "User registered successfully! Please check your campus email for the 6-digit verification code.",
        "email": new_user.email,
        "is_verified": False
    }

@router.post("/verify-email", response_model=Token)
def verify_email(data: VerifyEmail, db: Session = Depends(get_db)):
    """
    Step 2: Verify email using the 6-digit OTP code.
    Marks user as is_verified=True and returns JWT token.
    """
    email_clean = data.email.lower().strip()
    
    # Find active token matching email and code
    token_record = db.query(VerificationToken).filter(
        VerificationToken.email == email_clean,
        VerificationToken.otp_code == data.otp_code.strip(),
        VerificationToken.is_used == False,
        VerificationToken.expires_at > datetime.utcnow()
    ).order_by(VerificationToken.created_at.desc()).first()

    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification OTP code. Please check your email or request a new code."
        )

    # Find user and mark verified
    user = db.query(User).filter(User.id == token_record.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

    token_record.is_used = True
    user.is_verified = True
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer", user=UserResponse.model_validate(user))

@router.post("/resend-otp")
def resend_otp(data: ResendOTP, db: Session = Depends(get_db)):
    """
    Resend a new 6-digit OTP code to the specified email.
    """
    email_clean = data.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No user found with this campus email.")

    if user.is_verified:
        return {"message": "Your campus email is already verified. You can proceed to login."}

    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    token = VerificationToken(
        user_id=user.id,
        email=user.email,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.add(token)
    db.commit()

    send_verification_otp(user.email, otp_code)
    return {"message": f"A new 6-digit verification code has been sent to {user.email}."}

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Step 3: Authenticate user with email and password.
    Requires is_verified=True.
    """
    email_clean = credentials.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect campus email or password."
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Campus email not verified. Please verify your email using the OTP sent to your inbox."
        )

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer", user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current logged in user profile.
    """
    return current_user
