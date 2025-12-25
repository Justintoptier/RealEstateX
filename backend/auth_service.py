from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import pyotp
import secrets
import models
import schemas

def create_user(db: Session, user_data: schemas.UserCreate):
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        # Update role if provided
        if user_data.role and existing_user.role != user_data.role:
            existing_user.role = user_data.role
            db.commit()
            db.refresh(existing_user)
        return existing_user
    
    # Create new user
    db_user = models.User(
        username=user_data.username,
        email=user_data.email,
        role=user_data.role,
        picture=f"https://ui-avatars.com/api/?name={user_data.username.replace(' ', '+')}&background=fbbf24&color=000"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def enable_2fa_for_user(db: Session, user_id: str) -> str:
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate TOTP secret
    secret = pyotp.random_base32()
    user.totp_secret = secret
    user.is_2fa_enabled = True
    db.commit()
    db.refresh(user)
    return secret

def verify_otp(db: Session, user_id: str, otp_code: str) -> bool:
    user = get_user_by_id(db, user_id)
    if not user or not user.totp_secret:
        return False
    
    totp = pyotp.TOTP(user.totp_secret)
    # Verify with window to allow for time drift
    return totp.verify(otp_code, valid_window=1)

def create_session(db: Session, user_id: str) -> str:
    # Generate session token
    session_token = secrets.token_urlsafe(32)
    
    # Create session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    db_session = models.UserSession(
        user_id=user_id,
        session_token=session_token,
        expires_at=expires_at
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return session_token

def get_session(db: Session, session_token: str):
    session = db.query(models.UserSession).filter(
        models.UserSession.session_token == session_token
    ).first()
    
    if not session:
        return None
    
    # Check if expired
    expires_at = session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        db.delete(session)
        db.commit()
        return None
    
    return session

def delete_session(db: Session, session_token: str):
    session = db.query(models.UserSession).filter(
        models.UserSession.session_token == session_token
    ).first()
    if session:
        db.delete(session)
        db.commit()

def get_all_users(db: Session):
    return db.query(models.User).all()

def delete_user(db: Session, user_id: str):
    user = get_user_by_id(db, user_id)
    if user:
        db.delete(user)
        db.commit()
        return True
    return False

def update_user_role(db: Session, user_id: str, new_role: str):
    user = get_user_by_id(db, user_id)
    if user:
        user.role = new_role
        db.commit()
        db.refresh(user)
        return user
    return None
