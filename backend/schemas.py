from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str = 'user'

class UserCreate(UserBase):
    password: Optional[str] = None

class User(UserBase):
    user_id: str
    picture: Optional[str] = None
    is_2fa_enabled: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    email: EmailStr
    role: str = 'user'

class OTPVerifyRequest(BaseModel):
    temp_token: str
    otp_code: str

class SessionCreate(BaseModel):
    session_token: str
    email: EmailStr
    name: str
    picture: Optional[str] = None

# Property Schemas
class PropertyBase(BaseModel):
    name: str
    budget: float
    configurations: Optional[str] = None
    location: str
    price_per_sqft: Optional[float] = None
    carpet_area: Optional[float] = None
    developer: Optional[str] = None
    description: Optional[str] = None
    gmaps_link: Optional[str] = None
    tags: Optional[List[str]] = []

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    budget: Optional[float] = None
    configurations: Optional[str] = None
    location: Optional[str] = None
    price_per_sqft: Optional[float] = None
    carpet_area: Optional[float] = None
    developer: Optional[str] = None
    description: Optional[str] = None
    gmaps_link: Optional[str] = None
    tags: Optional[List[str]] = None
    is_hidden: Optional[bool] = None

class Property(PropertyBase):
    property_id: str
    video_file: Optional[str] = None
    floor_plan_file: Optional[str] = None
    is_hidden: bool = False
    field_visibility: Optional[dict] = None
    uploaded_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tags: List[str] = []
    
    class Config:
        from_attributes = True

# Field Visibility Schema
class FieldVisibilityUpdate(BaseModel):
    field_visibility: dict  # e.g., {"budget": false, "location": true, "price_per_sqft": false}

# Search Filters
class PropertySearchFilters(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    configurations: Optional[str] = None
    developer: Optional[str] = None
    min_price_per_sqft: Optional[float] = None
    max_price_per_sqft: Optional[float] = None
    min_carpet_area: Optional[float] = None
    max_carpet_area: Optional[float] = None
    tags: Optional[str] = None
    show_hidden: bool = False
