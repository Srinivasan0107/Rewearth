-- ReWearth Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE swap_status AS ENUM (
    'negotiating',
    'agreed',
    'scheduled',
    'pending_confirmation',
    'completed',
    'cancelled'
);

CREATE TYPE message_type AS ENUM (
    'TEXT',
    'SYSTEM',
    'OFFER_SWAP',
    'ACCEPT_SWAP',
    'REJECT_SWAP',
    'PROPOSE_MEETING',
    'CONFIRM_MEETING',
    'GENERATE_OTP',
    'OTP_VERIFIED',
    'ASK_SIZE',
    'ASK_CONDITION',
    'ASK_MORE_PHOTOS',
    'PROPOSE_TIME',
    'PROPOSE_LOCATION',
    'READY_TO_SWAP',
    'NOT_ELIGIBLE_SWAP'
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_auth_id VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    username VARCHAR NOT NULL UNIQUE,
    avatar_url VARCHAR,
    bio TEXT,
    coins INTEGER NOT NULL DEFAULT 120,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on supabase_auth_id for faster lookups
CREATE INDEX idx_users_supabase_auth_id ON users(supabase_auth_id);

-- Create wardrobe_items table
CREATE TABLE wardrobe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    condition VARCHAR(100) NOT NULL,
    image_url VARCHAR,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_items_is_available ON wardrobe_items(is_available);

-- Create swaps table
CREATE TABLE swaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status swap_status NOT NULL DEFAULT 'negotiating',
    coins_deducted BOOLEAN NOT NULL DEFAULT FALSE,
    requester_otp VARCHAR(6),
    owner_otp VARCHAR(6),
    requester_verified BOOLEAN NOT NULL DEFAULT FALSE,
    owner_verified BOOLEAN NOT NULL DEFAULT FALSE,
    meeting_time VARCHAR,
    meeting_location VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_swaps_item_id ON swaps(item_id);
CREATE INDEX idx_swaps_requester_id ON swaps(requester_id);
CREATE INDEX idx_swaps_owner_id ON swaps(owner_id);
CREATE INDEX idx_swaps_status ON swaps(status);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swap_id UUID NOT NULL REFERENCES swaps(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_type message_type NOT NULL DEFAULT 'TEXT',
    content TEXT,
    extra_data TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_chat_messages_swap_id ON chat_messages(swap_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Grant permissions (if needed)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
