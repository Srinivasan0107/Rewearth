# Troubleshooting Guide

## Issue: 403 Forbidden Error in Chat

### Problem
Users were getting a 403 Forbidden error when trying to access the chat page for a swap.

### Root Cause
The user was trying to access a swap that they were not a participant in. The swap had:
- Requester ID: `58f96ad5-2010-4022-8c7c-814a5b036f90`
- Owner ID: `d83f9ae1-daa7-4b45-b8cf-6943969d569f`

But the logged-in user had ID: `5ecdc30a-2f80-47bd-8a35-606c5d71652b`

### Solution
1. Added proper error handling in the frontend to detect 403 errors and redirect users to the marketplace
2. Improved error messages in the backend to be more descriptive
3. Fixed the frontend to wait for the database user ID before making API calls

### How to Test
1. Log in with your account
2. Go to the marketplace
3. Find an item you want to swap
4. Click "Request Swap"
5. You should be redirected to the chat page for YOUR swap
6. If you try to access someone else's swap URL, you'll be redirected to the marketplace

## Issue: CORS Error

### Problem
Frontend was getting CORS errors when trying to connect to the backend.

### Root Cause
Multiple Python processes were running with old code that didn't have proper CORS configuration.

### Solution
1. Killed all Python processes
2. Cleared `__pycache__` directories
3. Restarted the backend with proper CORS configuration

### Prevention
Always ensure only one backend process is running. Use `Get-Process python` to check for running processes.

## Issue: Frontend Using Wrong User ID

### Problem
The frontend was sometimes using the Supabase auth ID instead of the database user ID.

### Root Cause
The `fetchMessages` function was being called before `fetchCurrentUser` completed, so it fell back to using the Supabase auth ID.

### Solution
Changed the useEffect to wait for `fetchCurrentUser` to complete before calling `fetchMessages`:

```typescript
useEffect(() => {
  const init = async () => {
    await fetchCurrentUser();
    await fetchSwapDetails();
    await fetchMessages();
  };
  init();
  
  // Poll for new messages every 3 seconds
  const interval = setInterval(fetchMessages, 3000);
  return () => clearInterval(interval);
}, [swapId]);
```

Also updated `fetchMessages` to only proceed if `currentUserId` is set:

```typescript
const fetchMessages = async () => {
  if (!currentUserId) return; // Wait until we have the database user ID
  // ... rest of the function
};
```

## General Tips

1. **Check Process IDs**: Always verify which Python process is running your backend
2. **Clear Cache**: When making model changes, clear `__pycache__` directories
3. **Check User IDs**: Make sure you're using database IDs, not Supabase auth IDs
4. **Test Authorization**: Verify that users can only access their own swaps
5. **Monitor Logs**: Check backend logs for detailed error messages
