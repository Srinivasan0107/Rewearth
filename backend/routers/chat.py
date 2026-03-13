from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import random
import string

from database import get_db
from models import ChatMessage, Swap, User, MessageType, SwapStatus
from schemas import ChatMessageCreate, ChatMessageOut, UserPublic
from email_service import send_otp_email, send_swap_notification

router = APIRouter(prefix="/chat", tags=["Chat"])


def generate_otp(length=6):
    """Generate a random OTP code"""
    return ''.join(random.choices(string.digits, k=length))


@router.post("/{swap_id}/messages", response_model=ChatMessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    swap_id: UUID,
    message_data: ChatMessageCreate,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Send a chat message in a swap conversation"""
    # Verify swap exists and user is part of it
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    
    if user_id not in [swap.requester_id, swap.owner_id]:
        raise HTTPException(status_code=403, detail="Not authorized to send messages in this swap")
    
    # Create message
    message = ChatMessage(
        swap_id=swap_id,
        sender_id=user_id,
        message_type=message_data.message_type,
        content=message_data.content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return message


@router.get("/{swap_id}/messages", response_model=List[ChatMessageOut])
def get_messages(
    swap_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Get all messages for a swap"""
    # Verify swap exists and user is part of it
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    
    if user_id not in [swap.requester_id, swap.owner_id]:
        raise HTTPException(
            status_code=403, 
            detail=f"Not authorized to view messages in this swap. You must be either the requester or owner."
        )
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.swap_id == swap_id
    ).order_by(ChatMessage.created_at).all()
    
    return messages


@router.post("/{swap_id}/accept", response_model=dict)
def accept_swap(
    swap_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Accept a swap request (owner only)"""
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    
    if user_id != swap.owner_id:
        raise HTTPException(status_code=403, detail="Only the item owner can accept the swap")
    
    if swap.status != SwapStatus.negotiating:
        raise HTTPException(status_code=400, detail="Swap is not in negotiating status")
    
    swap.status = SwapStatus.agreed
    
    # Get users for email
    owner = db.query(User).filter(User.id == swap.owner_id).first()
    requester = db.query(User).filter(User.id == swap.requester_id).first()
    
    # Send notification to requester
    send_swap_notification(
        to_email=requester.email,
        username=requester.username,
        notification_type="swap_accepted",
        item_title=swap.item.title,
        owner_username=owner.username
    )
    
    # Create system message
    message = ChatMessage(
        swap_id=swap_id,
        sender_id=user_id,
        message_type=MessageType.ACCEPT_SWAP,
        content="Swap request accepted! Let's arrange a meeting."
    )
    db.add(message)
    db.commit()
    
    return {"message": "Swap accepted successfully"}


@router.post("/{swap_id}/propose-meeting", response_model=dict)
def propose_meeting(
    swap_id: UUID,
    meeting_time: str,
    meeting_location: str,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Propose meeting details"""
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    
    if user_id not in [swap.requester_id, swap.owner_id]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    swap.meeting_time = meeting_time
    swap.meeting_location = meeting_location
    swap.status = SwapStatus.scheduled
    
    # Create system message
    message = ChatMessage(
        swap_id=swap_id,
        sender_id=user_id,
        message_type=MessageType.PROPOSE_MEETING,
        content=f"Meeting proposed: {meeting_time} at {meeting_location}",
        extra_data=f"{meeting_time}|{meeting_location}"
    )
    db.add(message)
    db.commit()
    
    return {"message": "Meeting details proposed"}


@router.post("/{swap_id}/confirm-meeting", response_model=dict)
def confirm_meeting(
    swap_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Confirm meeting details"""
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    
    if user_id not in [swap.requester_id, swap.owner_id]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if not swap.meeting_time or not swap.meeting_location:
        raise HTTPException(status_code=400, detail="No meeting details to confirm")
    
    swap.status = SwapStatus.pending_confirmation
    
    # Create system message
    message = ChatMessage(
        swap_id=swap_id,
        sender_id=user_id,
        message_type=MessageType.CONFIRM_MEETING,
        content="Meeting confirmed! Generate OTP when you're ready to meet."
    )
    db.add(message)
    db.commit()
    
    return {"message": "Meeting confirmed"}


@router.post("/{swap_id}/generate-otp", response_model=dict)
def generate_swap_otp(
    swap_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Generate OTP for the user when they're ready to meet"""
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    
    if user_id not in [swap.requester_id, swap.owner_id]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if swap.status != SwapStatus.pending_confirmation:
        raise HTTPException(status_code=400, detail="Meeting must be confirmed first")
    
    # Generate OTP
    otp = generate_otp()
    
    # Get user details
    user = db.query(User).filter(User.id == user_id).first()
    other_user = db.query(User).filter(
        User.id == (swap.owner_id if user_id == swap.requester_id else swap.requester_id)
    ).first()
    
    if user_id == swap.requester_id:
        swap.requester_otp = otp
        role = "requester"
    else:
        swap.owner_otp = otp
        role = "owner"
    
    # Send OTP via email
    send_otp_email(
        to_email=user.email,
        username=user.username,
        otp=otp,
        item_title=swap.item.title,
        other_username=other_user.username
    )
    
    # Create system message
    message = ChatMessage(
        swap_id=swap_id,
        sender_id=user_id,
        message_type=MessageType.GENERATE_OTP,
        content=f"OTP generated and sent to email. Share it with the other person when you meet."
    )
    db.add(message)
    db.commit()
    
    return {
        "otp": otp,
        "message": "OTP generated and sent to your email. Share this with the other person when you meet in person.",
        "email_sent": True
    }


@router.post("/{swap_id}/verify-otp", response_model=dict)
def verify_otp(
    swap_id: UUID,
    other_user_otp: str,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """Verify the OTP from the other user"""
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")
    
    if user_id not in [swap.requester_id, swap.owner_id]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check which user is verifying
    if user_id == swap.requester_id:
        # Requester is verifying owner's OTP
        if swap.owner_otp != other_user_otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        swap.requester_verified = True
    else:
        # Owner is verifying requester's OTP
        if swap.requester_otp != other_user_otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        swap.owner_verified = True
    
    # If both verified, complete the swap
    if swap.requester_verified and swap.owner_verified:
        swap.status = SwapStatus.completed
        
        # Deduct coins if not already done
        if not swap.coins_deducted:
            requester = db.query(User).filter(User.id == swap.requester_id).first()
            if requester.coins >= 20:
                requester.coins -= 20
                swap.coins_deducted = True
        
        # Create completion message
        message = ChatMessage(
            swap_id=swap_id,
            sender_id=user_id,
            message_type=MessageType.OTP_VERIFIED,
            content="🎉 Swap completed successfully! Both OTPs verified."
        )
        db.add(message)
        db.commit()
        
        return {
            "message": "Swap completed successfully!",
            "status": "completed"
        }
    
    db.commit()
    return {
        "message": "OTP verified. Waiting for the other person to verify.",
        "status": "pending"
    }
