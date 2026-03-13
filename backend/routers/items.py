from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from ..database import get_db
from ..models import WardrobeItem, User
from ..schemas import WardrobeItemCreate, WardrobeItemOut, WardrobeItemUpdate
from ..config import settings
from supabase import create_client

router = APIRouter(prefix="/items", tags=["Items"])

SWAP_COST = 20


def get_supabase():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


@router.get("/", response_model=List[WardrobeItemOut])
def list_marketplace_items(
    skip: int = 0,
    limit: int = 50,
    category: Optional[str] = None,
    size: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(WardrobeItem).filter(WardrobeItem.is_available == True)
    if category:
        query = query.filter(WardrobeItem.category == category)
    if size:
        query = query.filter(WardrobeItem.size == size)
    return query.offset(skip).limit(limit).all()


@router.get("/{item_id}", response_model=WardrobeItemOut)
def get_item(item_id: UUID, db: Session = Depends(get_db)):
    item = db.query(WardrobeItem).filter(WardrobeItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=WardrobeItemOut, status_code=status.HTTP_201_CREATED)
def create_item(item_data: WardrobeItemCreate, user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    item = WardrobeItem(user_id=user_id, **item_data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    supabase = get_supabase()
    content = await file.read()
    filename = f"clothing/{file.filename}"
    res = supabase.storage.from_("clothing-images").upload(
        filename, content, {"content-type": file.content_type}
    )
    if hasattr(res, "error") and res.error:
        raise HTTPException(status_code=500, detail="Upload failed")
    public_url = supabase.storage.from_("clothing-images").get_public_url(filename)
    return {"image_url": public_url}


@router.patch("/{item_id}", response_model=WardrobeItemOut)
def update_item(item_id: UUID, update_data: WardrobeItemUpdate, db: Session = Depends(get_db)):
    item = db.query(WardrobeItem).filter(WardrobeItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, val in update_data.model_dump(exclude_none=True).items():
        setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: UUID, db: Session = Depends(get_db)):
    item = db.query(WardrobeItem).filter(WardrobeItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
