-- RESET DATABASE - Start Fresh
-- Run this in Supabase SQL Editor to clear all swap and message data
-- This will allow you to test the new simplified chat flow from scratch

-- Delete all chat messages first (foreign key constraint)
DELETE FROM chat_messages;

-- Delete all swaps
DELETE FROM swaps;

-- Verify deletion
SELECT 'Chat messages deleted' as status, COUNT(*) as remaining FROM chat_messages
UNION ALL
SELECT 'Swaps deleted' as status, COUNT(*) as remaining FROM swaps;
