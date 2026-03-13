from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import random
import string

from database import get_db
from models import Swap, SwapStatus, User, WardrobeItem, ChatMessage, MessageType
from schemas import SwapCreate, SwapOut, OTPVerify, ChatMessageCreate, ChatMessageOut, ProposeDetails, MESSAGE_RENDERED_TEXT

router = APIRouter(prefix="/swaps", tags=["Swaps"])

SWAP_COST = 20

VALID_TRANSITIONS = {
    SwapStatus.negotiating: [SwapStatus.agreed, SwapStatus.cancelled],
    SwapStatus.agreed: [SwapStatus.scheduled, SwapStatus.cancelled],
    SwapStatus.scheduled: [SwapStatus.pending_confirmation, SwapStatus.cancelled],
    SwapStatus.pending_confirmation: [SwapStatus.completed],
}


def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=4))


def render_swap(swap: Swap, db: Session) -> SwapOut:
    messages = [ChatMessageOut.from_orm_with_render(m) for m in swap.messages]
    return SwapOut(
        id=swap.id,
        item_id=swap.item_id,
        requester_id=swap.requester_id,
        owner_id=swap.owner_id,
        status=swap.status,
        coins_deducted=swap.coins_deducted,
        otp_code=swap.otp_code,
        confirmed_requester=swap.confirmed_requester,
        confirmed_owner=swap.confirmed_owner,
        proposed_time=swap.proposed_time,
        proposed_location=swap.proposed_location,
        created_at=swap.created_at,
        requester=swap.requester,
        owner=swap.owner,
        item=swap.item,
        messages=messages,
    )


@router.post("/", response_model=SwapOut, status_code=status.HTTP_201_CREATED)
def create_swap(swap_data: SwapCreate, requester_id: UUID, db: Session = Depends(get_db)):
    item = db.query(WardrobeItem).filter(WardrobeItem.id == swap_data.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not item.is_available:
        raise HTTPException(status_code=400, detail="Item is not available for swap")
    if str(item.user_id) == str(requester_id):
        raise HTTPException(status_code=400, detail="Cannot swap your own item")

    existing = db.query(Swap).filter(
        Swap.item_id == swap_data.item_id,
        Swap.requester_id == requester_id,
        Swap.status.in_([SwapStatus.negotiating, SwapStatus.agreed, SwapStatus.scheduled]),
    ).first()
    if existing:
        return render_swap(existing, db)

    swap = Swap(
        item_id=swap_data.item_id,
        requester_id=requester_id,
        owner_id=item.user_id,
        status=SwapStatus.negotiating,
    )
    db.add(swap)
    db.commit()
    db.refresh(swap)
    return render_swap(swap, db)


@router.get("/{swap_id}", response_model=SwapOut)
def get_swap(swap_id: UUID, db: Session = Depends(get_db)):
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    return render_swap(swap, db)


@router.get("/user/{user_id}", response_model=List[SwapOut])
def get_user_swaps(user_id: UUID, db: Session = Depends(get_db)):
    swaps = db.query(Swap).filter(
        (Swap.requester_id == user_id) | (Swap.owner_id == user_id)
    ).all()
    return [render_swap(s, db) for s in swaps]


@router.post("/{swap_id}/message", response_model=SwapOut)
def send_message(swap_id: UUID, msg_data: ChatMessageCreate, sender_id: UUID, db: Session = Depends(get_db)):
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")

    sender = db.query(User).filter(User.id == sender_id).first()
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")

    is_requester = str(swap.requester_id) == str(sender_id)
    is_owner = str(swap.owner_id) == str(sender_id)
    if not is_requester and not is_owner:
        raise HTTPException(status_code=403, detail="Not a participant in this swap")

    # Handle ACCEPT_SWAP: check coins and deduct if both accepted
    if msg_data.message_type == MessageType.ACCEPT_SWAP:
        requester = db.query(User).filter(User.id == swap.requester_id).first()
        owner = db.query(User).filter(User.id == swap.owner_id).first()

        if requester.coins < SWAP_COST or owner.coins < SWAP_COST:
            msg = ChatMessage(
                swap_id=swap_id,
                sender_id=sender_id,
                message_type=MessageType.NOT_ELIGIBLE_SWAP,
            )
            db.add(msg)
            db.commit()
            db.refresh(swap)
            return render_swap(swap, db)

        # Check if both have now accepted
        prior_accepts = db.query(ChatMessage).filter(
            ChatMessage.swap_id == swap_id,
            ChatMessage.message_type == MessageType.ACCEPT_SWAP,
        ).count()

        msg = ChatMessage(swap_id=swap_id, sender_id=sender_id, message_type=MessageType.ACCEPT_SWAP, payload=msg_data.payload)
        db.add(msg)

        if prior_accepts >= 1 and not swap.coins_deducted:
            requester.coins -= SWAP_COST
            owner.coins -= SWAP_COST
            swap.coins_deducted = True
            swap.status = SwapStatus.agreed
            db.commit()
            db.refresh(swap)
            return render_swap(swap, db)

        db.commit()
        db.refresh(swap)
        return render_swap(swap, db)

    # Handle REJECT_SWAP
    if msg_data.message_type == MessageType.REJECT_SWAP:
        swap.status = SwapStatus.cancelled
        msg = ChatMessage(swap_id=swap_id, sender_id=sender_id, message_type=MessageType.REJECT_SWAP)
        db.add(msg)
        db.commit()
        db.refresh(swap)
        return render_swap(swap, db)

    # Handle PROPOSE_TIME
    if msg_data.message_type == MessageType.PROPOSE_TIME and msg_data.payload:
        swap.proposed_time = msg_data.payload

    # Handle PROPOSE_LOCATION
    if msg_data.message_type == MessageType.PROPOSE_LOCATION and msg_data.payload:
        swap.proposed_location = msg_data.payload

    # Handle CONFIRM_MEETING
    if msg_data.message_type == MessageType.CONFIRM_MEETING:
        if swap.status == SwapStatus.agreed:
            swap.status = SwapStatus.scheduled

    # Handle READY_TO_SWAP: generate OTP and move to pending_confirmation
    if msg_data.message_type == MessageType.READY_TO_SWAP:
        if swap.status == SwapStatus.scheduled:
            otp = generate_otp()
            swap.otp_code = otp
            swap.status = SwapStatus.pending_confirmation

    msg = ChatMessage(
        swap_id=swap_id,
        sender_id=sender_id,
        message_type=msg_data.message_type,
        payload=msg_data.payload,
    )
    db.add(msg)
    db.commit()
    db.refresh(swap)
    return render_swap(swap, db)


@router.post("/{swap_id}/verify-otp", response_model=SwapOut)
def verify_otp(swap_id: UUID, otp_data: OTPVerify, verifier_id: UUID, db: Session = Depends(get_db)):
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    if swap.status != SwapStatus.pending_confirmation:
        raise HTTPException(status_code=400, detail="Swap is not awaiting OTP confirmation")
    if swap.otp_code != otp_data.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    is_requester = str(swap.requester_id) == str(verifier_id)
    is_owner = str(swap.owner_id) == str(verifier_id)

    if is_requester:
        swap.confirmed_requester = True
    elif is_owner:
        swap.confirmed_owner = True
    else:
        raise HTTPException(status_code=403, detail="Not a participant in this swap")

    if swap.confirmed_requester and swap.confirmed_owner:
        swap.status = SwapStatus.completed
        item = db.query(WardrobeItem).filter(WardrobeItem.id == swap.item_id).first()
        if item:
            item.is_available = False

    db.commit()
    db.refresh(swap)
    return render_swap(swap, db)
