# Simplified Instagram-Style Chat Flow

## Overview
The chat feature has been redesigned to be simpler and more intuitive, similar to Instagram's direct messaging. Instead of free-form text chat, users interact through quick action buttons and pre-defined messages.

## User Flow

### 1. Swap Request (Negotiating Status)
- **Requester**: Sees "Pending" status, waits for owner to accept
- **Owner**: Sees "Accept Swap Request" button
  - Clicks to accept → Status changes to "Agreed"

### 2. Arrange Meeting (Agreed Status)
- **Either User** can propose meeting details:
  - Click "Propose Meeting Time & Place"
  - Enter when (e.g., "Tomorrow 3 PM")
  - Enter where (e.g., "Campus Cafe")
  - Click "Send Proposal" → Status changes to "Scheduled"

### 3. Confirm Meeting (Scheduled Status)
- **Other User** sees the proposed meeting details
- Clicks "Confirm Meeting" → Status changes to "Pending Confirmation"

### 4. In-Person Swap (Pending Confirmation Status)
When both users arrive at the meeting location:

**Each User:**
1. Clicks "Generate My OTP" → Gets a 6-digit code
2. Shows their OTP to the other person
3. Enters the other person's OTP in the input field
4. Clicks "Verify & Complete Swap"

**When Both Verify:**
- Status changes to "Completed"
- 20 coins are deducted from requester
- Success message displayed

## Quick Reply Messages
Instead of typing, users can click pre-defined messages:
- "Hi! I'm interested in swapping 👋"
- "Sounds good to me! ✅"
- "When would be a good time to meet?"
- "I'm available this weekend"
- "Let's meet at the campus cafe"
- "See you there! 👍"

## Key Features

### Visual Design
- Clean, modern Instagram-style interface
- Color-coded status badges
- Gradient backgrounds for action cards
- Large, easy-to-read OTP display

### User Experience
- No typing required (except for meeting details and OTP)
- Clear step-by-step progression
- Visual feedback for each status
- Auto-refresh every 3 seconds

### Security
- OTP verification ensures both parties are present
- Authorization checks prevent unauthorized access
- Each user generates their own OTP
- OTPs are sent via email for backup

## Status Flow
```
negotiating → agreed → scheduled → pending_confirmation → completed
```

## Benefits
1. **Simpler**: No need to type messages back and forth
2. **Faster**: Quick action buttons speed up the process
3. **Clearer**: Visual status indicators show progress
4. **Safer**: OTP verification confirms in-person meeting
5. **Mobile-Friendly**: Large buttons and touch-friendly interface
