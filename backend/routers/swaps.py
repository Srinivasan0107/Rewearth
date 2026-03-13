from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
from models import Swap, SwapStatus, WardrobeItem
from schemas import SwapCreate, SwapOut

router = APIRouter(prefix="/swaps", tags=["Swaps"])


@router.post("/", response_model=SwapOut, status_code=status.HTTP_201_CREATED)
def create_swap(swap_data: SwapCreate, requester_id: UUID, db: Session = Depends(get_db)):
    """Create a new swap request"""
    item = db.query(WardrobeItem).filter(WardrobeItem.id == swap_data.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not item.is_available:
        raise HTTPException(status_code=400, detail="Item is not available for swap")
    if str(item.user_id) == str(requester_id):
        raise HTTPException(status_code=400, detail="Cannot swap your own item")

    # Check if swap already exists
    existing = db.query(Swap).filter(
        Swap.item_id == swap_data.item_id,
        Swap.requester_id == requester_id,
        Swap.status.in_([SwapStatus.negotiating, SwapStatus.agreed, SwapStatus.scheduled, SwapStatus.pending_confirmation]),
    ).first()
    if existing:
        return existing

    # Create new swap
    swap = Swap(
        item_id=swap_data.item_id,
        requester_id=requester_id,
        owner_id=item.user_id,
        status=SwapStatus.negotiating,
    )
    db.add(swap)
    db.commit()
    db.refresh(swap)
    return swap


@router.get("/{swap_id}", response_model=SwapOut)
def get_swap(swap_id: UUID, db: Session = Depends(get_db)):
    """Get swap details"""
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    return swap


@router.get("/user/{user_id}", response_model=List[SwapOut])
def get_user_swaps(user_id: UUID, db: Session = Depends(get_db)):
    """Get all swaps for a user"""
    swaps = db.query(Swap).filter(
        (Swap.requester_id == user_id) | (Swap.owner_id == user_id)
    ).order_by(Swap.created_at.desc()).all()
    return swaps
