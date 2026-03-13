-- Migration to update chat and swap tables for new OTP system

-- Update swaps table
ALTER TABLE swaps 
  DROP COLUMN IF EXISTS otp_code,
  DROP COLUMN IF EXISTS confirmed_requester,
  DROP COLUMN IF EXISTS confirmed_owner,
  DROP COLUMN IF EXISTS proposed_time,
  DROP COLUMN IF EXISTS proposed_location;

ALTER TABLE swaps
  ADD COLUMN IF NOT EXISTS requester_otp VARCHAR(6),
  ADD COLUMN IF NOT EXISTS owner_otp VARCHAR(6),
  ADD COLUMN IF NOT EXISTS requester_verified BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS owner_verified BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS meeting_time VARCHAR,
  ADD COLUMN IF NOT EXISTS meeting_location VARCHAR;

-- Update chat_messages table
ALTER TABLE chat_messages
  DROP COLUMN IF EXISTS payload;

ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS extra_data TEXT;

-- Update message_type enum (you may need to recreate the enum type)
-- This is a simplified version - in production you'd handle this more carefully
ALTER TYPE messagetype RENAME TO messagetype_old;

CREATE TYPE messagetype AS ENUM (
  'TEXT',
  'SYSTEM',
  'OFFER_SWAP',
  'ACCEPT_SWAP',
  'REJECT_SWAP',
  'PROPOSE_MEETING',
  'CONFIRM_MEETING',
  'GENERATE_OTP',
  'OTP_VERIFIED'
);

ALTER TABLE chat_messages 
  ALTER COLUMN message_type TYPE messagetype USING message_type::text::messagetype;

DROP TYPE messagetype_old;
