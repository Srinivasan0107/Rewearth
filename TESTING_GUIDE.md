# ReWearth Testing Guide

## Current Status

✅ **Backend Running:** `http://localhost:8000`  
✅ **Frontend Running:** `http://localhost:3000`  
✅ **No TypeScript Errors**  
✅ **All Features Implemented**

## What's Working

### 1. Authentication
- Google OAuth login
- Email/password signup
- User sessions

### 2. Marketplace
- Browse items
- Filter by category and size
- Search functionality

### 3. Wardrobe
- Add items with image upload
- View your items
- Item details

### 4. Swap System
- Request swaps
- Real-time chat
- Meeting proposals
- OTP generation and verification

### 5. Chat Feature (NEW!)
- Instagram-style chat interface
- Free-text messaging
- System notifications
- Meeting coordination
- OTP exchange

## Testing the Complete Flow

### Step 1: Create Two Accounts
1. Open `http://localhost:3000/login`
2. Sign up as User A (e.g., alice@test.com)
3. Open incognito window
4. Sign up as User B (e.g., bob@test.com)

### Step 2: Add an Item (User A)
1. Go to "Add Item" in wardrobe
2. Upload an image
3. Fill in details (title, category, size, condition)
4. Submit

### Step 3: Request Swap (User B)
1. Browse marketplace
2. Find User A's item
3. Click "Request Swap"
4. You'll be redirected to chat page

### Step 4: Chat & Negotiate
1. User B sends message: "Hi! Is this available?"
2. User A responds: "Yes! It's in great condition"
3. User B: "Perfect! Let's swap!"

### Step 5: Accept Swap (User A)
1. User A clicks "Accept Swap Request"
2. Status changes to "agreed"
3. Both users get notification

### Step 6: Propose Meeting
1. Either user clicks "Propose Meeting Details"
2. Enter time: "Tomorrow 3 PM"
3. Enter location: "Central Park"
4. Submit

### Step 7: Confirm Meeting
1. Other user clicks "Confirm Meeting"
2. Status changes to "pending_confirmation"

### Step 8: Generate OTPs
1. Both users click "Generate My OTP"
2. Each receives a 6-digit code
3. **If email configured:** OTP sent to email
4. **If not configured:** OTP shown in app only

### Step 9: Exchange OTPs (In Person)
1. Users meet at Central Park
2. User A shows their OTP to User B
3. User B enters User A's OTP in app
4. User A enters User B's OTP in app

### Step 10: Complete Swap
1. Once both OTPs verified
2. Status changes to "completed"
3. 20 coins deducted from requester
4. Item marked as unavailable
5. Success! 🎉

## Testing Without Email

The app works perfectly without email configuration:

1. OTPs are displayed in the app UI
2. OTPs are printed to backend console
3. Users can still complete swaps
4. All functionality works

**To see OTP in console:**
```bash
# Check backend terminal
⚠️  Email not configured. OTP for alice: 123456
```

## Testing With Email

### Setup Resend (5 minutes):
1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to `backend/.env`:
   ```env
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=ReWearth <onboarding@resend.dev>
   ```
4. Restart backend
5. Generate OTP - check your email!

## Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution:** Frontend is already running, just use it!

### Issue: CORS errors
**Solution:** Make sure backend is running on port 8000

### Issue: Can't upload images
**Solution:** 
1. Check Supabase storage bucket exists
2. Bucket name: `clothing-images`
3. Make it public

### Issue: OTP not in email
**Solution:**
1. Check spam folder
2. Verify RESEND_API_KEY in .env
3. Check backend console for errors
4. OTP still shows in app UI

### Issue: Database errors
**Solution:** Run the migration:
```sql
-- In Supabase SQL Editor
-- Copy contents from backend/migration_chat_update.sql
```

## API Endpoints

### Health Check
```
GET http://localhost:8000/health
```

### Chat Endpoints
```
POST /chat/{swap_id}/messages - Send message
GET /chat/{swap_id}/messages - Get messages
POST /chat/{swap_id}/accept - Accept swap
POST /chat/{swap_id}/propose-meeting - Propose meeting
POST /chat/{swap_id}/confirm-meeting - Confirm meeting
POST /chat/{swap_id}/generate-otp - Generate OTP
POST /chat/{swap_id}/verify-otp - Verify OTP
```

### Swap Endpoints
```
POST /swaps/ - Create swap
GET /swaps/{swap_id} - Get swap details
GET /swaps/user/{user_id} - Get user swaps
```

## Browser DevTools

### Check Network Tab
- All API calls should return 200
- Check request/response data
- Look for CORS errors

### Check Console
- Should be no errors
- React DevTools available
- Hot reload working

## Performance

- Chat messages poll every 3 seconds
- Auto-scroll to latest message
- Smooth animations
- Fast page loads

## Security

✅ OTPs are 6-digit random numbers  
✅ Each user has unique OTP  
✅ Both must verify in person  
✅ No remote verification possible  
✅ Coins only deducted after verification  

## Next Steps

1. ✅ Test basic flow
2. ✅ Test chat functionality
3. ✅ Test OTP generation
4. ⏳ Configure email (optional)
5. ⏳ Test with real users
6. ⏳ Deploy to production

## Production Checklist

Before deploying:

- [ ] Set up custom domain for emails
- [ ] Configure production Supabase
- [ ] Update CORS origins
- [ ] Set up monitoring
- [ ] Test on mobile devices
- [ ] Add error tracking (Sentry)
- [ ] Set up backups
- [ ] Configure rate limiting
- [ ] Add analytics

## Support

- **Backend Logs:** Check terminal running uvicorn
- **Frontend Logs:** Check browser console
- **Database:** Check Supabase dashboard
- **Email:** Check Resend dashboard

## Summary

Everything is working! The app is ready for testing:

✅ Backend: `http://localhost:8000`  
✅ Frontend: `http://localhost:3000`  
✅ Chat: Real-time messaging  
✅ OTP: Generation & verification  
✅ Email: Ready to configure  

Happy testing! 🌱👕♻️
