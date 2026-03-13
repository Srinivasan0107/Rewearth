export interface User {
  id: string;
  supabase_auth_id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  coins: number;
  created_at: string;
}

export interface UserPublic {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  coins: number;
}

export interface WardrobeItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  size: string;
  condition: string;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  owner: UserPublic;
}

export type SwapStatus =
  | "negotiating"
  | "agreed"
  | "scheduled"
  | "pending_confirmation"
  | "completed"
  | "cancelled";

export type MessageType =
  | "ASK_CONDITION"
  | "ASK_SIZE"
  | "ASK_MORE_PHOTOS"
  | "OFFER_SWAP"
  | "ACCEPT_SWAP"
  | "REJECT_SWAP"
  | "PROPOSE_TIME"
  | "PROPOSE_LOCATION"
  | "CONFIRM_MEETING"
  | "READY_TO_SWAP"
  | "NOT_ELIGIBLE_SWAP";

export interface ChatMessage {
  id: string;
  swap_id: string;
  sender_id: string;
  message_type: MessageType;
  rendered_text: string;
  payload?: string;
  created_at: string;
  sender: UserPublic;
}

export interface Swap {
  id: string;
  item_id: string;
  requester_id: string;
  owner_id: string;
  status: SwapStatus;
  coins_deducted: boolean;
  otp_code?: string;
  confirmed_requester: boolean;
  confirmed_owner: boolean;
  proposed_time?: string;
  proposed_location?: string;
  created_at: string;
  requester: UserPublic;
  owner: UserPublic;
  item: WardrobeItem;
  messages: ChatMessage[];
}
