from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum
import uuid


class SwapStatus(str, enum.Enum):
    negotiating = "negotiating"
    agreed = "agreed"
    scheduled = "scheduled"
    pending_confirmation = "pending_confirmation"
    completed = "completed"
    cancelled = "cancelled"


class MessageType(str, enum.Enum):
    ASK_CONDITION = "ASK_CONDITION"
    ASK_SIZE = "ASK_SIZE"
    ASK_MORE_PHOTOS = "ASK_MORE_PHOTOS"
    OFFER_SWAP = "OFFER_SWAP"
    ACCEPT_SWAP = "ACCEPT_SWAP"
    REJECT_SWAP = "REJECT_SWAP"
    PROPOSE_TIME = "PROPOSE_TIME"
    PROPOSE_LOCATION = "PROPOSE_LOCATION"
    CONFIRM_MEETING = "CONFIRM_MEETING"
    READY_TO_SWAP = "READY_TO_SWAP"
    NOT_ELIGIBLE_SWAP = "NOT_ELIGIBLE_SWAP"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    supabase_auth_id = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    coins = Column(Integer, default=120, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    wardrobe_items = relationship("WardrobeItem", back_populates="owner")
    swaps_as_requester = relationship("Swap", foreign_keys="Swap.requester_id", back_populates="requester")
    swaps_as_owner = relationship("Swap", foreign_keys="Swap.owner_id", back_populates="owner")
    chat_messages = relationship("ChatMessage", back_populates="sender")


class WardrobeItem(Base):
    __tablename__ = "wardrobe_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    size = Column(String(50), nullable=False)
    condition = Column(String(100), nullable=False)
    image_url = Column(String, nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="wardrobe_items")
    swaps = relationship("Swap", back_populates="item")


class Swap(Base):
    __tablename__ = "swaps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("wardrobe_items.id"), nullable=False)
    requester_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(SAEnum(SwapStatus), default=SwapStatus.negotiating, nullable=False)
    coins_deducted = Column(Boolean, default=False, nullable=False)
    otp_code = Column(String(4), nullable=True)
    confirmed_requester = Column(Boolean, default=False, nullable=False)
    confirmed_owner = Column(Boolean, default=False, nullable=False)
    proposed_time = Column(String, nullable=True)
    proposed_location = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    item = relationship("WardrobeItem", back_populates="swaps")
    requester = relationship("User", foreign_keys=[requester_id], back_populates="swaps_as_requester")
    owner = relationship("User", foreign_keys=[owner_id], back_populates="swaps_as_owner")
    messages = relationship("ChatMessage", back_populates="swap", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    swap_id = Column(UUID(as_uuid=True), ForeignKey("swaps.id"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message_type = Column(SAEnum(MessageType), nullable=False)
    payload = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    swap = relationship("Swap", back_populates="messages")
    sender = relationship("User", back_populates="chat_messages")
