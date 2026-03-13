from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from models import SwapStatus, MessageType


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
    content: str
    message_type: Optional[MessageType] = MessageType.TEXT

class ChatMessageOut(BaseModel):
    id: UUID
    swap_id: UUID
    sender_id: UUID
    message_type: MessageType
    content: Optional[str]
    extra_data: Optional[str]
    created_at: datetime
    sender: UserPublic

    class Config:
        from_attributes = True


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
    requester_otp: Optional[str]
    owner_otp: Optional[str]
    requester_verified: bool
    owner_verified: bool
    meeting_time: Optional[str]
    meeting_location: Optional[str]
    created_at: datetime
    requester: UserPublic
    owner: UserPublic
    item: WardrobeItemOut
    # messages: List[ChatMessageOut]  # Removed to prevent loading issues with old data

    class Config:
        from_attributes = True

class OTPGenerate(BaseModel):
    pass

class OTPVerify(BaseModel):
    otp_code: str

class MeetingProposal(BaseModel):
    meeting_time: str
    meeting_location: str
