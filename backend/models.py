from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    role = Column(String, default='user')  # 'user' or 'admin'
    picture = Column(String, nullable=True)
    totp_secret = Column(String, nullable=True)
    is_2fa_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    sessions = relationship('UserSession', back_populates='user', cascade='all, delete-orphan')
    properties = relationship('Property', back_populates='uploaded_by_user', foreign_keys='Property.uploaded_by')

class UserSession(Base):
    __tablename__ = 'user_sessions'
    
    session_id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    session_token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship('User', back_populates='sessions')

class Property(Base):
    __tablename__ = 'properties'
    
    property_id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, index=True)
    budget = Column(Float, nullable=False)
    configurations = Column(String, nullable=True)
    location = Column(String, nullable=False, index=True)
    price_per_sqft = Column(Float, nullable=True)
    carpet_area = Column(Float, nullable=True)
    developer = Column(String, nullable=True, index=True)
    description = Column(Text, nullable=True)
    gmaps_link = Column(String, nullable=True)
    video_file = Column(String, nullable=True)
    floor_plan_file = Column(String, nullable=True)
    is_hidden = Column(Boolean, default=False)
    uploaded_by = Column(String, ForeignKey('users.user_id'), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    uploaded_by_user = relationship('User', back_populates='properties', foreign_keys=[uploaded_by])
    tags = relationship('PropertyTag', back_populates='property', cascade='all, delete-orphan')

class PropertyTag(Base):
    __tablename__ = 'property_tags'
    
    tag_id = Column(String, primary_key=True, default=generate_uuid)
    property_id = Column(String, ForeignKey('properties.property_id', ondelete='CASCADE'), nullable=False)
    tag_name = Column(String, nullable=False, index=True)
    
    # Relationships
    property = relationship('Property', back_populates='tags')
