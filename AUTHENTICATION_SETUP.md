# Authentication Setup Guide

This guide will help you set up Google OAuth and email/password authentication for ReWearth.

## Features Implemented

✅ Google OAuth Sign-In
✅ Email/Password Sign-Up
✅ Email/Password Sign-In
✅ Email Verification
✅ Automatic User Sync with Backend
✅ Toggle between Sign In and Sign Up modes

## Setup Instructions

### 1. Supabase Configuration

#### Enable Email Authentication
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider
4. Configure email templates (optional but recommended)

#### Enable Google OAuth
1. Go to **Authentication** → **Providers**
2. Find **Google** and click to configure
3. You'll need to create a Google OAuth application:

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: ReWearth
   - User support email: your email
   - Developer contact: your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: ReWearth
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain
   - Authorized redirect URIs:
     - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

### 3. Configure Supabase with Google Credentials

1. Return to Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

### 4. Environment Variables

Make sure your environment files are configured:

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_KEY=[ANON-KEY]
SUPABASE_SERVICE_KEY=[SERVICE-ROLE-KEY]
```

### 5. Test Authentication

1. Start your backend server:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Navigate to `http://localhost:3000/login`
4. Test both authentication methods:
   - Sign up with email/password
   - Sign in with Google

## How It Works

### Email/Password Flow
1. User enters email and password
2. For Sign Up:
   - Supabase creates auth user
   - Sends verification email
   - User must verify email before signing in
3. For Sign In:
   - Supabase validates credentials
   - Creates session
   - Redirects to marketplace

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google login
3. After approval, redirected to `/auth/callback`
4. Callback exchanges code for session
5. User data synced with backend
6. Redirected to marketplace

## Security Features

- Passwords are hashed by Supabase (never stored in plain text)
- Email verification required for new accounts
- Secure session management
- HTTPS required in production
- CORS protection

## Troubleshooting

### "Invalid login credentials"
- Check if email is verified (for email/password)
- Verify password is correct
- Check Supabase logs

### Google OAuth not working
- Verify redirect URI matches exactly in Google Console
- Check Client ID and Secret in Supabase
- Ensure Google provider is enabled

### User not syncing to backend
- Check backend is running
- Verify API URL in environment variables
- Check backend logs for errors

## Next Steps

Consider adding:
- Password reset functionality
- Social login with other providers (GitHub, Facebook)
- Two-factor authentication
- Remember me functionality
- Session timeout handling
