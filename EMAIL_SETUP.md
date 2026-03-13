# Email Setup Guide for ReWearth

## Overview
ReWearth sends OTP codes and notifications via email using the Resend API service.

## Features
- OTP codes sent to email when generated
- Beautiful HTML email templates
- Swap notifications (request, accepted, meeting proposed, completed)
- Fallback to console logging if email not configured

## Setup Options

### Option 1: Resend (Recommended - Easiest)

Resend is a modern email API that's free for up to 3,000 emails/month.

#### Steps:

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Sign up with your email or GitHub
   - It's free for 3,000 emails/month

2. **Get your API Key**
   - After signing in, go to API Keys
   - Click "Create API Key"
   - Give it a name like "ReWearth"
   - Copy the API key (starts with `re_`)

3. **Add Domain (Optional but Recommended)**
   - Go to Domains section
   - Add your domain (e.g., `rewearth.app`)
   - Follow DNS verification steps
   - Or use their test domain for development

4. **Update Backend .env**
   ```env
   RESEND_API_KEY=re_your_actual_api_key_here
   EMAIL_FROM=ReWearth <noreply@yourdomain.com>
   ```

5. **Install Dependencies**
   ```bash
   cd backend
   pip install resend==0.8.0
   ```

6. **Restart Backend**
   ```bash
   python -m uvicorn main:app --reload
   ```

### Option 2: Gmail SMTP (Alternative)

If you prefer using Gmail, you can modify the email service to use SMTP.

#### Steps:

1. **Enable 2-Factor Authentication on Gmail**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Enable it

2. **Generate App Password**
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "ReWearth"
   - Copy the 16-character password

3. **Install SMTP Library**
   ```bash
   pip install aiosmtplib
   ```

4. **Update .env**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   EMAIL_FROM=ReWearth <your-email@gmail.com>
   ```

5. **Modify email_service.py** (I can help with this if you choose this option)

## Email Templates

### OTP Email
When a user generates an OTP, they receive:
- Large, easy-to-read OTP code
- Instructions on how to use it
- Security warnings
- Swap details (item, other user)

### Notification Emails
Users receive notifications for:
- New swap requests
- Swap accepted
- Meeting proposed
- Swap completed

## Testing

### Test Email Sending

1. **Start the backend**
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. **Create a swap and generate OTP**
   - The OTP will be sent to the user's email
   - Check your inbox (and spam folder)

3. **Check Console Logs**
   - If email is not configured, OTP will be printed to console
   - Look for: `⚠️  Email not configured. OTP for username: 123456`

### Without Email Configuration

If you don't configure email, the system will:
- Print OTPs to the console/terminal
- Still work normally
- Show OTP in the app UI
- Log all email attempts

## Email Content

### OTP Email Preview
```
Subject: 🌱 Your ReWearth Swap OTP: 123456

Hi username,

You're about to complete a swap with @other_user for Item Title!

Your OTP Code: 123456

How to use this OTP:
1. Meet with @other_user at your agreed location
2. Show them this OTP code
3. They will enter your OTP in their app
4. You will enter their OTP in your app
5. Once both OTPs are verified, the swap is complete!

Security Notice: Only share this OTP in person.
```

## Troubleshooting

### Emails Not Sending

1. **Check API Key**
   - Make sure `RESEND_API_KEY` is set in `.env`
   - Verify the key is correct (starts with `re_`)

2. **Check Console Logs**
   - Look for error messages
   - Check if email service is initialized

3. **Verify Email Address**
   - Make sure user email is valid
   - Check spam folder

4. **Test with Resend Dashboard**
   - Go to Resend dashboard
   - Check Logs section
   - See if emails are being sent

### Rate Limits

- Resend free tier: 3,000 emails/month
- If you exceed, upgrade or use SMTP

### Domain Verification

For production:
1. Add your domain in Resend
2. Add DNS records (SPF, DKIM)
3. Wait for verification
4. Update `EMAIL_FROM` with your domain

## Production Recommendations

1. **Use Custom Domain**
   - Better deliverability
   - Professional appearance
   - Add to Resend and verify

2. **Monitor Email Logs**
   - Check Resend dashboard regularly
   - Monitor bounce rates
   - Track delivery rates

3. **Add Unsubscribe Link**
   - For notification emails
   - Required for compliance

4. **Test Thoroughly**
   - Test with different email providers
   - Check spam scores
   - Verify all templates

## Cost

### Resend Pricing
- Free: 3,000 emails/month
- Pro: $20/month for 50,000 emails
- Enterprise: Custom pricing

### Gmail SMTP
- Free for personal use
- Limited to 500 emails/day
- May have deliverability issues

## Quick Start (Development)

For quick testing without email setup:

1. **Skip email configuration**
   - Don't add `RESEND_API_KEY` to `.env`
   - OTPs will print to console

2. **Check Terminal**
   ```
   ⚠️  Email not configured. OTP for alice: 123456
   ```

3. **Use OTP from Console**
   - Copy the OTP from terminal
   - Enter it in the app

## Support

- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
- ReWearth Issues: Create an issue in the repo

## Next Steps

1. Sign up for Resend
2. Get API key
3. Add to `.env`
4. Install `resend` package
5. Restart backend
6. Test OTP generation
7. Check email inbox
8. Celebrate! 🎉
