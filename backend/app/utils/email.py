import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

def generate_otp() -> str:
    """Generate a random 6-digit numeric OTP code."""
    return f"{random.randint(100000, 999999)}"

def send_verification_otp(to_email: str, otp_code: str) -> bool:
    """
    Sends the 6-digit email verification OTP code.
    If SMTP credentials are provided, sends an email via SMTP.
    Otherwise, logs the OTP clearly to the terminal for local dev.
    """
    subject = "SideQuest - Verify Your Campus Email"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 3px solid #000; border-radius: 12px; background-color: #F3F1EB;">
      <h2 style="color: #000; text-transform: uppercase; font-weight: 900;">SideQuest Campus Verification 🚀</h2>
      <p style="font-size: 16px; color: #333;">Welcome to SideQuest! Use the following 6-digit verification code to confirm your campus email address:</p>
      <div style="background: #EAB308; padding: 15px; border: 2px solid #000; border-radius: 8px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 5px; margin: 20px 0;">
        {otp_code}
      </div>
      <p style="font-size: 14px; color: #666;">This code is valid for <strong>{settings.OTP_EXPIRE_MINUTES} minutes</strong>. If you did not request this code, please ignore this email.</p>
    </div>
    """

    # Print to console for development visibility
    print("\n" + "="*60)
    print(f"📧 EMAIL VERIFICATION OTP SENT TO: {to_email}")
    print(f"🔑 VERIFICATION CODE: {otp_code}")
    print(f"⏳ EXPIRES IN: {settings.OTP_EXPIRE_MINUTES} minutes")
    print("="*60 + "\n")

    # If SMTP is configured, attempt email delivery
    if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
            msg["To"] = to_email

            part = MIMEText(html_content, "html")
            msg.attach(part)

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.EMAILS_FROM_EMAIL, to_email, msg.as_string())
            print(f"✅ SMTP email successfully delivered to {to_email}")
            return True
        except Exception as e:
            print(f"⚠️ SMTP delivery failed: {e}. Falling back to console OTP.")
            return False
    return True
