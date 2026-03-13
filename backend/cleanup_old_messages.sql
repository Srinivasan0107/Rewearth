-- Clean up old messages with invalid message types
-- This removes messages that have old enum values that no longer exist

-- Delete messages with old message types
DELETE FROM chat_messages 
WHERE message_type NOT IN (
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

-- Optionally, you can also delete all old swaps and start fresh
-- Uncomment the lines below if you want to start with a clean slate:

-- DELETE FROM chat_messages;
-- DELETE FROM swaps;
