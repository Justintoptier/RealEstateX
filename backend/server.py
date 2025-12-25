from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Cookie, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional, List
import pyotp
import secrets
import os
import shutil
from pathlib import Path

# Import our modules
from database import engine, get_db, Base
import models
import schemas
import auth_service
import property_service

# Create tables
Base.metadata.create_all(bind=engine)

# Create upload directory
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI(title="MAK Kotwal Venus API")

# Create API router with prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get current user
async def get_current_user(
    session_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Try cookie first, then Authorization header
    token = session_token
    if not token and authorization:
        if authorization.startswith("Bearer "):
            token = authorization[7:]
        else:
            token = authorization
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = auth_service.get_session(db, token)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    user = auth_service.get_user_by_id(db, session.user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# Dependency to get admin user
async def get_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/init-2fa")
async def init_2fa(
    login_data: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    """Initialize 2FA for login/signup"""
    # Create or get user
    user = auth_service.get_user_by_email(db, login_data.email)
    if not user:
        user = auth_service.create_user(db, schemas.UserCreate(
            username=login_data.username,
            email=login_data.email,
            role=login_data.role
        ))
    
    # Enable 2FA and get secret
    secret = auth_service.enable_2fa_for_user(db, user.user_id)
    
    # Generate temporary token
    temp_token = secrets.token_urlsafe(32)
    
    # Store temp mapping (in production, use Redis or similar)
    # For now, we'll use the session mechanism
    from datetime import datetime, timedelta, timezone
    temp_session = models.UserSession(
        user_id=user.user_id,
        session_token=f"temp_{temp_token}",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
    )
    db.add(temp_session)
    db.commit()
    
    # Generate TOTP URI for QR code
    totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=user.email,
        issuer_name="MAK Kotwal Venus"
    )
    
    # For demo, generate a test OTP
    totp = pyotp.TOTP(secret)
    demo_otp = totp.now()
    
    return {
        "temp_token": temp_token,
        "totp_uri": totp_uri,
        "secret": secret,
        "demo_otp": demo_otp  # Only for demo purposes
    }

@api_router.post("/auth/verify-2fa")
async def verify_2fa(
    verify_data: schemas.OTPVerifyRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """Verify OTP and create session"""
    # Get temp session
    temp_session = db.query(models.UserSession).filter(
        models.UserSession.session_token == f"temp_{verify_data.temp_token}"
    ).first()
    
    if not temp_session:
        raise HTTPException(status_code=400, detail="Invalid or expired temporary token")
    
    # Verify OTP
    if not auth_service.verify_otp(db, temp_session.user_id, verify_data.otp_code):
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    # Delete temp session
    db.delete(temp_session)
    db.commit()
    
    # Create real session
    session_token = auth_service.create_session(db, temp_session.user_id)
    
    # Get user
    user = auth_service.get_user_by_id(db, temp_session.user_id)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,  # 7 days
        path="/"
    )
    
    return {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "picture": user.picture,
        "is_2fa_enabled": user.is_2fa_enabled
    }

@api_router.post("/auth/session")
async def create_session_from_google(
    session_data: schemas.SessionCreate,
    response: Response,
    db: Session = Depends(get_db)
):
    """Create session from Google auth"""
    # Create or get user
    user = auth_service.get_user_by_email(db, session_data.email)
    if not user:
        user = auth_service.create_user(db, schemas.UserCreate(
            username=session_data.name,
            email=session_data.email,
            role='user'
        ))
        user.picture = session_data.picture
        db.commit()
    
    # Create session
    session_token = auth_service.create_session(db, user.user_id)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    return {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "picture": user.picture
    }

@api_router.get("/auth/me")
async def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "picture": current_user.picture,
        "is_2fa_enabled": current_user.is_2fa_enabled
    }

@api_router.post("/auth/logout")
async def logout(
    response: Response,
    session_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
):
    """Logout user"""
    if session_token:
        auth_service.delete_session(db, session_token)
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# ==================== USER MANAGEMENT ENDPOINTS ====================

@api_router.get("/users", response_model=List[schemas.User])
async def get_all_users(
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = auth_service.get_all_users(db)
    return users

@api_router.post("/users", response_model=schemas.User)
async def create_new_user(
    user_data: schemas.UserCreate,
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create new user (admin only)"""
    user = auth_service.create_user(db, user_data)
    return user

@api_router.delete("/users/{user_id}")
async def delete_user_endpoint(
    user_id: str,
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete user (admin only)"""
    if auth_service.delete_user(db, user_id):
        return {"message": "User deleted successfully"}
    raise HTTPException(status_code=404, detail="User not found")

@api_router.patch("/users/{user_id}/role")
async def update_user_role_endpoint(
    user_id: str,
    new_role: str,
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update user role (admin only)"""
    user = auth_service.update_user_role(db, user_id, new_role)
    if user:
        return {"message": "User role updated", "user": user}
    raise HTTPException(status_code=404, detail="User not found")

# ==================== PROPERTY ENDPOINTS ====================

@api_router.post("/properties", response_model=schemas.Property)
async def create_property_endpoint(
    name: str = Form(...),
    budget: float = Form(...),
    location: str = Form(...),
    configurations: Optional[str] = Form(None),
    price_per_sqft: Optional[float] = Form(None),
    carpet_area: Optional[float] = Form(None),
    developer: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    gmaps_link: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    video_file: Optional[UploadFile] = File(None),
    floor_plan_file: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new property"""
    # Handle file uploads
    video_filename = None
    if video_file:
        video_filename = f"{secrets.token_hex(8)}_{video_file.filename}"
        video_path = UPLOAD_DIR / video_filename
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video_file.file, buffer)
    
    floor_plan_filename = None
    if floor_plan_file:
        floor_plan_filename = f"{secrets.token_hex(8)}_{floor_plan_file.filename}"
        floor_plan_path = UPLOAD_DIR / floor_plan_filename
        with open(floor_plan_path, "wb") as buffer:
            shutil.copyfileobj(floor_plan_file.file, buffer)
    
    # Parse tags
    tag_list = [tag.strip() for tag in tags.split(',')] if tags else []
    
    # Create property
    property_data = schemas.PropertyCreate(
        name=name,
        budget=budget,
        location=location,
        configurations=configurations,
        price_per_sqft=price_per_sqft,
        carpet_area=carpet_area,
        developer=developer,
        description=description,
        gmaps_link=gmaps_link,
        tags=tag_list
    )
    
    db_property = property_service.create_property(
        db, property_data, current_user.user_id, video_filename, floor_plan_filename
    )
    
    return property_service.property_to_schema(db_property)

@api_router.get("/properties", response_model=List[schemas.Property])
async def get_properties_endpoint(
    skip: int = 0,
    limit: int = 100,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all properties"""
    show_hidden = current_user.role == 'admin' if current_user else False
    properties = property_service.get_properties(db, skip, limit, show_hidden)
    return [property_service.property_to_schema(p) for p in properties]

@api_router.post("/properties/search", response_model=List[schemas.Property])
async def search_properties_endpoint(
    filters: schemas.PropertySearchFilters,
    db: Session = Depends(get_db),
    session_token: Optional[str] = Cookie(None)
):
    """Search properties with filters (public endpoint, but admin sees hidden properties)"""
    # Try to get current user if session exists
    current_user = None
    if session_token:
        try:
            session = auth_service.get_session(db, session_token)
            if session:
                current_user = auth_service.get_user_by_id(db, session.user_id)
        except:
            pass
    
    # Admin can see hidden properties
    if current_user and current_user.role == 'admin':
        filters.show_hidden = True
    
    properties = property_service.search_properties(db, filters)
    return [property_service.property_to_schema(p) for p in properties]

@api_router.get("/properties/{property_id}", response_model=schemas.Property)
async def get_property_endpoint(
    property_id: str,
    db: Session = Depends(get_db)
):
    """Get single property"""
    db_property = property_service.get_property(db, property_id)
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_service.property_to_schema(db_property)

@api_router.patch("/properties/{property_id}", response_model=schemas.Property)
async def update_property_endpoint(
    property_id: str,
    property_data: schemas.PropertyUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update property"""
    db_property = property_service.update_property(db, property_id, property_data)
    return property_service.property_to_schema(db_property)

@api_router.patch("/properties/{property_id}/toggle-visibility")
async def toggle_property_visibility_endpoint(
    property_id: str,
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Toggle property visibility (admin only)"""
    db_property = property_service.toggle_property_visibility(db, property_id)
    return property_service.property_to_schema(db_property)

@api_router.delete("/properties/{property_id}")
async def delete_property_endpoint(
    property_id: str,
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete property (admin only)"""
    if property_service.delete_property(db, property_id):
        return {"message": "Property deleted successfully"}
    raise HTTPException(status_code=404, detail="Property not found")

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "MAK Kotwal Venus API is running", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include the router in the main app
app.include_router(api_router)
