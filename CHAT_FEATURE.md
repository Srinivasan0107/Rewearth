# Chat & OTP Verification Feature

## Overview
ReWearth now includes a real-time chat system for swap negotiations with secure OTP verification for in-person exchanges.

## Features

### 1. Real-Time Chat
- Instagram-style chat interface
- Free-text messaging between swap participants
- System messages for important events
- Auto-scrolling to latest messages
- Message polling every 3 seconds

### 2. Swap Flow

#### Step 1: Negotiation
- User requests a swap on an item
- Both parties can chat freely
- Owner can accept or reject the swap request

#### Step 2: Agreement
- Once owner accepts, status changes to "agreed"
- Either party can propose meeting details (time & location)

#### Step 3: Scheduling
- Meeting details are proposed
- Other party confirms the meeting
- Status changes to "scheduled"

#### Step 4: Meeting Confirmation
- Both parties confirm they're ready to meet
- Status changes to "pending_confirmation"

#### Step 5: OTP Generation & Verification
- When users arrive at the meeting location, each generates their own 6-digit OTP
- They show their OTP to each other in person
- Each person enters the other's OTP in the app
- Once both OTPs are verified, the swap is completed
- Coins are deducted from the requester

### 3. Security Features
- OTPs are 6-digit random numbers
- Each user has their own unique OTP
- Both users must verify each other's OTP
- OTPs are only generated when meeting is confirmed
- Prevents remote/fraudulent swaps
- **OTPs are sent via email for easy access**
- Email notifications for key swap events

## API Endpoints

### Chat Messages
- `POST /chat/{swap_id}/messages` - Send a message
- `GET /chat/{swap_id}/messages` - Get all messages

### Swap Actions
- `POST /chat/{swap_id}/accept` - Accept swap (owner only)
- `POST /chat/{swap_id}/propose-meeting` - Propose meeting details
- `POST /chat/{swap_id}/confirm-meeting` - Confirm meeting
- `POST /chat/{swap_id}/generate-otp` - Generate your OTP
- `POST /chat/{swap_id}/verify-otp` - Verify other person's OTP

## Database Schema

### Swaps Table Updates
```sql
- requester_otp: VARCHAR(6) - OTP for requester
- owner_otp: VARCHAR(6) - OTP for owner
- requester_verified: BOOLEAN - Has requester verified owner's OTP?
- owner_verified: BOOLEAN - Has owner verified requester's OTP?
- meeting_time: VARCHAR - Proposed meeting time
- meeting_location: VARCHAR - Proposed meeting location
```

### Chat Messages Table Updates
```sql
- message_type: ENUM - Type of message (TEXT, SYSTEM, etc.)
- content: TEXT - Message content
- metadata: TEXT - Additional data (JSON string)
```

## Frontend Pages

### `/chat/[swapId]`
Main chat interface with:
- Item header showing swap details
- Status indicator
- Action buttons based on swap status
- Message list with auto-scroll
- Message input
- OTP generation and verification UI

## Usage Flow Example

1. Alice sees Bob's jacket and clicks "Request Swap"
2. Alice is redirected to chat page
3. Alice and Bob chat about the item
4. Bob accepts the swap (Alice gets email notification)
5. Alice proposes: "Tomorrow 3 PM at Central Park"
6. Bob confirms the meeting
7. Tomorrow at 3 PM, both arrive at Central Park
8. Alice clicks "Generate OTP" - receives 123456 via email
9. Bob clicks "Generate OTP" - receives 789012 via email
10. They show each other their phones/emails
11. Alice enters Bob's OTP (789012)
12. Bob enters Alice's OTP (123456)
13. Swap is completed! 🎉
14. Both receive completion email
15. 20 coins are deducted from Alice

## Migration

Run the migration script to update your database:
```bash
psql $DATABASE_URL < backend/migration_chat_update.sql
```

Or manually apply the changes in Supabase SQL Editor.

## Testing

1. Start backend: `cd backend && python -m uvicorn main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Create two user accounts
4. User 1: Add an item to wardrobe
5. User 2: Request swap on that item
6. Test the full flow from chat to OTP verification

## Security Considerations

- OTPs are only valid for the current swap
- OTPs are generated fresh each time
- Both parties must be physically present to exchange OTPs
- No remote verification possible
- Coins are only deducted after successful verification

## Future Enhancements

- Push notifications for new messages
- Image sharing in chat
- Meeting location map integration
- OTP expiration timer
- Swap rating system
- Dispute resolution system
