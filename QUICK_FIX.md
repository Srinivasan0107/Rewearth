# Quick Fix for Database Issues

## Problem
The database has old messages with invalid message types (`ASK_CONDITION`) that don't exist in the current code. This causes the backend to crash with a 500 error.

## Solution: Reset the Database

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Reset Script
Copy and paste this SQL into the editor:

```sql
-- Delete all chat messages first (foreign key constraint)
DELETE FROM chat_messages;

-- Delete all swaps
DELETE FROM swaps;

-- Verify deletion
SELECT 'Chat messages deleted' as status, COUNT(*) as remaining FROM chat_messages
UNION ALL
SELECT 'Swaps deleted' as status, COUNT(*) as remaining FROM swaps;
```

### Step 3: Click "Run" to execute

This will delete all old swap and message data, allowing you to start fresh with the new simplified chat flow.

## After Reset

1. The backend should now work without errors
2. Go to the marketplace in your app
3. Click "Request Swap" on any item
4. You'll be redirected to the new simplified chat page
5. Test the flow:
   - Owner accepts the swap
   - Propose meeting time & place
   - Confirm meeting
   - Generate OTPs
   - Verify OTPs to complete

## Why This Happened

The database had old message types from previous versions of the code:
- Old: `ASK_CONDITION`, `MESSAGE_RENDERED_TEXT`, etc.
- New: `TEXT`, `SYSTEM`, `ACCEPT_SWAP`, `PROPOSE_MEETING`, etc.

The reset clears this old data so the new code can work properly.

## Alternative: Keep User Data

If you want to keep user accounts and wardrobe items but just reset swaps:

```sql
-- Only delete swaps and messages, keep users and items
DELETE FROM chat_messages;
DELETE FROM swaps;
```

This preserves all user accounts and wardrobe items, only removing swap history.
