from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from .models import SwapStatus, MessageType

MESSAGE_RENDERED_TEXT = {
    MessageType.ASK_CONDITION: "What is the condition of this item?",
    MessageType.ASK_SIZE: "Can you confirm the exact size?",
    MessageType.ASK_MORE_PHOTOS: "Could you share more photos?",
    MessageType.OFFER_SWAP: "I would like to swap for this item.",
    MessageType.ACCEPT_SWAP: "I accept this swap request.",
    MessageType.REJECT_SWAP: "I am rejecting this swap request.",
    MessageType.PROPOSE_TIME: "I'd like to propose a meeting time.",
    MessageType.PROPOSE_LOCATION: "I'd like to propose a meeting location.",
    MessageType.CONFIRM_MEETING: "I confirm the meeting details.",
    MessageType.READY_TO_SWAP: "I am ready to complete the swap!",
    MessageType.NOT_ELIGIBLE_SWAP: "Insufficient coins to proceed with this swap.",
}


# ─── User Schemas ───────────────────────────────────────────────
class UserCreate(BaseModel):
    supabase_auth_id: str
    email: EmailStr
    username: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserOut(BaseModel):
    id: UUID
    supabase_auth_id: str
    email: str
    username: str
    avatar_url: Optional[str]
    bio: Optional[str]
    coins: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserPublic(BaseModel):
    id: UUID
    username: str
    avatar_url: Optional[str]
    bio: Optional[str]
    coins: int

    class Config:
        from_attributes = True


# ─── Wardrobe Item Schemas ───────────────────────────────────────
class WardrobeItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    size: str
    condition: str
    image_url: Optional[str] = None

class WardrobeItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    size: Optional[str] = None
    condition: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None

class WardrobeItemOut(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    category: str
    size: str
    condition: str
    image_url: Optional[str]
    is_available: bool
    created_at: datetime
    owner: UserPublic

    class Config:
        from_attributes = True


# ─── Chat Message Schemas ────────────────────────────────────────
class ChatMessageCreate(BaseModel):
    message_type: MessageType
    payload: Optional[str] = None

class ChatMessageOut(BaseModel):
    id: UUID
    swap_id: UUID
    sender_id: UUID
    message_type: MessageType
    rendered_text: str
    payload: Optional[str]
    created_at: datetime
    sender: UserPublic

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_render(cls, msg):
        return cls(
            id=msg.id,
            swap_id=msg.swap_id,
            sender_id=msg.sender_id,
            message_type=msg.message_type,
            rendered_text=MESSAGE_RENDERED_TEXT.get(msg.message_type, msg.message_type.value),
            payload=msg.payload,
            created_at=msg.created_at,
            sender=UserPublic.model_validate(msg.sender),
        )


# ─── Swap Schemas ─────────────────────────────────────────────────
class SwapCreate(BaseModel):
    item_id: UUID

class SwapOut(BaseModel):
    id: UUID
    item_id: UUID
    requester_id: UUID
    owner_id: UUID
    status: SwapStatus
    coins_deducted: bool
    otp_code: Optional[str]
    confirmed_requester: bool
    confirmed_owner: bool
    proposed_time: Optional[str]
    proposed_location: Optional[str]
    created_at: datetime
    requester: UserPublic
    owner: UserPublic
    item: WardrobeItemOut
    messages: List[ChatMessageOut]

    class Config:
        from_attributes = True

class OTPVerify(BaseModel):
    otp_code: str

class ProposeDetails(BaseModel):
    value: str
