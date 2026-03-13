from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..database import get_db
from ..models import User, WardrobeItem
from ..schemas import UserCreate, UserOut, UserPublic, UserUpdate, WardrobeItemOut

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_or_get_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.supabase_auth_id == user_data.supabase_auth_id).first()
    if existing:
        return existing

    username_taken = db.query(User).filter(User.username == user_data.username).first()
    username = user_data.username
    if username_taken:
        import random
        username = f"{username}_{random.randint(100, 999)}"

    user = User(**user_data.model_dump())
    user.username = username
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me/{supabase_auth_id}", response_model=UserOut)
def get_me(supabase_auth_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.supabase_auth_id == supabase_auth_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{username}", response_model=UserPublic)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserOut)
def update_user(user_id: UUID, update_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, val in update_data.model_dump(exclude_none=True).items():
        setattr(user, key, val)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{username}/wardrobe", response_model=List[WardrobeItemOut])
def get_user_wardrobe(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    items = db.query(WardrobeItem).filter(WardrobeItem.user_id == user.id).all()
    return items
