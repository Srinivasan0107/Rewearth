# ReWearth Swap Flow with Email OTP

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    REWEARTH SWAP FLOW                           │
└─────────────────────────────────────────────────────────────────┘

STEP 1: DISCOVERY
┌──────────────┐
│   Alice      │  Browses marketplace
│   👤         │  Sees Bob's jacket
└──────────────┘  Clicks "Request Swap"
                  ↓
                  Creates swap request
                  Status: NEGOTIATING
                  ↓
┌──────────────┐  📧 Email sent to Bob
│   Bob        │  "New swap request from @alice"
│   👤         │
└──────────────┘


STEP 2: CHAT & NEGOTIATION
┌─────────────────────────────────────────┐
│         💬 Chat Interface               │
├─────────────────────────────────────────┤
│  Alice: Hi! Is this still available?    │
│  Bob: Yes! It's in great condition      │
│  Alice: Perfect! Can we swap?           │
│  Bob: [Accept Swap Button]              │
└─────────────────────────────────────────┘
                  ↓
                  Bob accepts
                  Status: AGREED
                  ↓
                  📧 Email to Alice
                  "Swap accepted by @bob"


STEP 3: MEETING ARRANGEMENT
┌─────────────────────────────────────────┐
│  Alice: [Propose Meeting]               │
│  Time: Tomorrow 3 PM                    │
│  Location: Central Park                 │
└─────────────────────────────────────────┘
                  ↓
                  Status: SCHEDULED
                  ↓
┌─────────────────────────────────────────┐
│  Bob: [Confirm Meeting]                 │
│  ✓ Confirmed                            │
└─────────────────────────────────────────┘
                  ↓
                  Status: PENDING_CONFIRMATION


STEP 4: MEETING DAY - OTP GENERATION
┌──────────────────────────────────────────────────────────┐
│  Tomorrow at Central Park                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Alice arrives → [Generate OTP]                         │
│                  ↓                                       │
│                  Backend generates: 123456               │
│                  ↓                                       │
│                  📧 Email to alice@email.com             │
│                  ┌─────────────────────────────┐        │
│                  │  Your OTP: 1 2 3 4 5 6     │        │
│                  │  Share with @bob in person  │        │
│                  └─────────────────────────────┘        │
│                  ↓                                       │
│                  Shows in app UI                         │
│                                                          │
│  Bob arrives → [Generate OTP]                           │
│                ↓                                         │
│                Backend generates: 789012                 │
│                ↓                                         │
│                📧 Email to bob@email.com                 │
│                ┌─────────────────────────────┐          │
│                │  Your OTP: 7 8 9 0 1 2     │          │
│                │  Share with @alice in person│          │
│                └─────────────────────────────┘          │
│                ↓                                         │
│                Shows in app UI                           │
└──────────────────────────────────────────────────────────┘


STEP 5: OTP EXCHANGE (IN PERSON)
┌─────────────────────────────────────────┐
│  Alice shows phone/email to Bob         │
│  "My OTP is 123456"                     │
│                                         │
│  Bob shows phone/email to Alice         │
│  "My OTP is 789012"                     │
└─────────────────────────────────────────┘


STEP 6: OTP VERIFICATION
┌─────────────────────────────────────────┐
│  Alice enters Bob's OTP: 789012         │
│  ✓ Verified!                            │
│                                         │
│  Bob enters Alice's OTP: 123456         │
│  ✓ Verified!                            │
└─────────────────────────────────────────┘
                  ↓
                  Both OTPs verified
                  ↓
                  Status: COMPLETED
                  ↓
                  20 coins deducted from Alice
                  ↓
                  📧 Emails to both
                  "Swap completed! 🎉"


STEP 7: COMPLETION
┌─────────────────────────────────────────┐
│  🎉 Swap Completed Successfully!        │
│                                         │
│  Alice: -20 coins, +1 jacket            │
│  Bob: +0 coins, -1 jacket               │
│                                         │
│  Both can rate the experience           │
└─────────────────────────────────────────┘
```

## Email Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    EMAIL NOTIFICATIONS                      │
└─────────────────────────────────────────────────────────────┘

Event                    Email To        Content
─────────────────────────────────────────────────────────────
Swap Requested    →      Owner          "New request from @user"
Swap Accepted     →      Requester      "Swap accepted by @owner"
Meeting Proposed  →      Other User     "Meeting at X on Y"
OTP Generated     →      Self           "Your OTP: 123456"
Swap Completed    →      Both           "Swap completed! 🎉"


┌─────────────────────────────────────────┐
│         OTP EMAIL TEMPLATE              │
├─────────────────────────────────────────┤
│  From: ReWearth <noreply@rewearth.app> │
│  To: alice@email.com                    │
│  Subject: 🌱 Your ReWearth Swap OTP     │
├─────────────────────────────────────────┤
│                                         │
│  Hi alice,                              │
│                                         │
│  You're about to complete a swap       │
│  with @bob for Blue Denim Jacket!      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │      Your OTP Code                │ │
│  │                                   │ │
│  │       1 2 3 4 5 6                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  How to use:                            │
│  1. Meet with @bob                      │
│  2. Show this code                      │
│  3. Enter their OTP                     │
│  4. Complete swap!                      │
│                                         │
│  ⚠️  Only share in person!              │
│                                         │
│  ReWearth - Sustainable Fashion         │
└─────────────────────────────────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY MEASURES                        │
└─────────────────────────────────────────────────────────────┘

1. OTP Generation
   ├─ Random 6-digit code
   ├─ Unique per user
   ├─ Generated only when meeting confirmed
   └─ Stored in database

2. OTP Distribution
   ├─ Sent via email (secure)
   ├─ Shown in app (convenient)
   └─ Not shared in chat (security)

3. OTP Verification
   ├─ Must be entered by other person
   ├─ Both must verify each other
   ├─ In-person exchange required
   └─ No remote verification possible

4. Swap Completion
   ├─ Only when both OTPs verified
   ├─ Coins deducted automatically
   ├─ Status updated to completed
   └─ Confirmation emails sent

┌─────────────────────────────────────────┐
│  Why This is Secure:                    │
├─────────────────────────────────────────┤
│  ✓ Requires physical presence           │
│  ✓ Both parties must verify             │
│  ✓ OTPs are unique and random           │
│  ✓ No remote fraud possible             │
│  ✓ Email provides backup access         │
└─────────────────────────────────────────┘
```

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  SYSTEM ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────┘

Frontend (Next.js)
    ↓
    Chat Page (/chat/[swapId])
    ↓
    API Calls
    ↓
Backend (FastAPI)
    ↓
    /chat/generate-otp
    ↓
    ├─ Generate random OTP
    ├─ Store in database
    ├─ Call email_service.py
    │   ↓
    │   Resend API
    │   ↓
    │   📧 Email delivered
    │
    └─ Return OTP to frontend

Database (PostgreSQL)
    ├─ swaps table
    │   ├─ requester_otp
    │   ├─ owner_otp
    │   ├─ requester_verified
    │   └─ owner_verified
    │
    └─ chat_messages table
        └─ OTP generation messages
```

## Status Transitions

```
NEGOTIATING
    ↓ (Owner accepts)
AGREED
    ↓ (Meeting proposed)
SCHEDULED
    ↓ (Meeting confirmed)
PENDING_CONFIRMATION
    ↓ (Both OTPs verified)
COMPLETED
```

## Error Handling

```
┌─────────────────────────────────────────┐
│  What if email fails?                   │
├─────────────────────────────────────────┤
│  ✓ OTP still shown in app               │
│  ✓ Error logged to console              │
│  ✓ User can still complete swap         │
│  ✓ Fallback to app UI                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  What if user loses OTP?                │
├─────────────────────────────────────────┤
│  ✓ Check email                          │
│  ✓ Regenerate OTP (future feature)      │
│  ✓ Contact support                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  What if wrong OTP entered?             │
├─────────────────────────────────────────┤
│  ✓ Error message shown                  │
│  ✓ Can try again                        │
│  ✓ No limit on attempts                 │
└─────────────────────────────────────────┘
```

## Summary

This flow ensures:
- ✅ Secure in-person verification
- ✅ Easy OTP access via email
- ✅ Professional user experience
- ✅ Fraud prevention
- ✅ Reliable swap completion
