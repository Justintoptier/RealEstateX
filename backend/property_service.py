from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional, List
import models
import schemas

def create_property(db: Session, property_data: schemas.PropertyCreate, user_id: Optional[str] = None,
                   video_file: Optional[str] = None, floor_plan_file: Optional[str] = None):
    # Create property
    db_property = models.Property(
        name=property_data.name,
        budget=property_data.budget,
        configurations=property_data.configurations,
        location=property_data.location,
        price_per_sqft=property_data.price_per_sqft,
        carpet_area=property_data.carpet_area,
        developer=property_data.developer,
        description=property_data.description,
        gmaps_link=property_data.gmaps_link,
        video_file=video_file,
        floor_plan_file=floor_plan_file,
        uploaded_by=user_id
    )
    db.add(db_property)
    db.flush()  # Get property_id without committing
    
    # Add tags
    if property_data.tags:
        for tag in property_data.tags:
            db_tag = models.PropertyTag(
                property_id=db_property.property_id,
                tag_name=tag.strip()
            )
            db.add(db_tag)
    
    db.commit()
    db.refresh(db_property)
    return db_property

def get_property(db: Session, property_id: str):
    return db.query(models.Property).filter(models.Property.property_id == property_id).first()

def get_properties(db: Session, skip: int = 0, limit: int = 100, show_hidden: bool = False):
    query = db.query(models.Property)
    if not show_hidden:
        query = query.filter(models.Property.is_hidden == False)
    return query.offset(skip).limit(limit).all()

def search_properties(db: Session, filters: schemas.PropertySearchFilters):
    query = db.query(models.Property)
    
    # Apply filters
    if filters.name:
        query = query.filter(models.Property.name.ilike(f"%{filters.name}%"))
    
    if filters.location:
        query = query.filter(models.Property.location.ilike(f"%{filters.location}%"))
    
    if filters.min_budget is not None:
        query = query.filter(models.Property.budget >= filters.min_budget)
    
    if filters.max_budget is not None:
        query = query.filter(models.Property.budget <= filters.max_budget)
    
    if filters.configurations:
        query = query.filter(models.Property.configurations.ilike(f"%{filters.configurations}%"))
    
    if filters.developer:
        query = query.filter(models.Property.developer.ilike(f"%{filters.developer}%"))
    
    if filters.min_price_per_sqft is not None:
        query = query.filter(models.Property.price_per_sqft >= filters.min_price_per_sqft)
    
    if filters.max_price_per_sqft is not None:
        query = query.filter(models.Property.price_per_sqft <= filters.max_price_per_sqft)
    
    if filters.min_carpet_area is not None:
        query = query.filter(models.Property.carpet_area >= filters.min_carpet_area)
    
    if filters.max_carpet_area is not None:
        query = query.filter(models.Property.carpet_area <= filters.max_carpet_area)
    
    # Filter by tags
    if filters.tags:
        tag_list = [tag.strip() for tag in filters.tags.split(',')]
        query = query.join(models.PropertyTag).filter(
            models.PropertyTag.tag_name.in_(tag_list)
        )
    
    # Hide hidden properties for non-admin
    if not filters.show_hidden:
        query = query.filter(models.Property.is_hidden == False)
    
    return query.all()

def update_property(db: Session, property_id: str, property_data: schemas.PropertyUpdate):
    db_property = get_property(db, property_id)
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Update fields
    update_data = property_data.dict(exclude_unset=True, exclude={'tags'})
    for key, value in update_data.items():
        setattr(db_property, key, value)
    
    # Update tags if provided
    if property_data.tags is not None:
        # Delete existing tags
        db.query(models.PropertyTag).filter(
            models.PropertyTag.property_id == property_id
        ).delete()
        
        # Add new tags
        for tag in property_data.tags:
            db_tag = models.PropertyTag(
                property_id=property_id,
                tag_name=tag.strip()
            )
            db.add(db_tag)
    
    db.commit()
    db.refresh(db_property)
    return db_property

def toggle_property_visibility(db: Session, property_id: str):
    db_property = get_property(db, property_id)
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db_property.is_hidden = not db_property.is_hidden
    db.commit()
    db.refresh(db_property)
    return db_property

def delete_property(db: Session, property_id: str):
    db_property = get_property(db, property_id)
    if db_property:
        db.delete(db_property)
        db.commit()
        return True
    return False

def property_to_schema(db_property: models.Property) -> schemas.Property:
    """Convert database property to schema with tags"""
    tags = [tag.tag_name for tag in db_property.tags]
    return schemas.Property(
        property_id=db_property.property_id,
        name=db_property.name,
        budget=db_property.budget,
        configurations=db_property.configurations,
        location=db_property.location,
        price_per_sqft=db_property.price_per_sqft,
        carpet_area=db_property.carpet_area,
        developer=db_property.developer,
        description=db_property.description,
        gmaps_link=db_property.gmaps_link,
        video_file=db_property.video_file,
        floor_plan_file=db_property.floor_plan_file,
        is_hidden=db_property.is_hidden,
        uploaded_by=db_property.uploaded_by,
        created_at=db_property.created_at,
        updated_at=db_property.updated_at,
        tags=tags
    )
