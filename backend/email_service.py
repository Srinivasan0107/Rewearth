import resend
from config import settings
from typing import Optional

# Initialize Resend with API key
if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY


def send_otp_email(to_email: str, username: str, otp: str, item_title: str, other_username: str) -> bool:
    """
    Send OTP via email to user
    
    Args:
        to_email: Recipient email address
        username: Recipient username
        otp: The 6-digit OTP code
        item_title: The item being swapped
        other_username: The other person in the swap
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    if not settings.RESEND_API_KEY:
        print(f"⚠️  Email not configured. OTP for {username}: {otp}")
        return False
    
    try:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .container {{
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 40px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .logo {{
                    font-size: 32px;
                    font-weight: bold;
                    color: #10b981;
                    margin-bottom: 10px;
                }}
                .otp-box {{
                    background: #f0fdf4;
                    border: 3px solid #10b981;
                    border-radius: 12px;
                    padding: 30px;
                    text-align: center;
                    margin: 30px 0;
                }}
                .otp-code {{
                    font-size: 48px;
                    font-weight: bold;
                    color: #10b981;
                    letter-spacing: 8px;
                    font-family: 'Courier New', monospace;
                }}
                .info-box {{
                    background: #f9fafb;
                    border-left: 4px solid #10b981;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    color: #6b7280;
                    font-size: 14px;
                }}
                .warning {{
                    background: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 15px;
                    margin: 20px 0;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🌱 ReWearth</div>
                    <h2 style="color: #1f2937; margin: 0;">Your Swap OTP Code</h2>
                </div>
                
                <p>Hi <strong>{username}</strong>,</p>
                
                <p>You're about to complete a swap with <strong>@{other_username}</strong> for <strong>{item_title}</strong>!</p>
                
                <div class="otp-box">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your OTP Code</p>
                    <div class="otp-code">{otp}</div>
                </div>
                
                <div class="info-box">
                    <h3 style="margin-top: 0; color: #1f2937;">How to use this OTP:</h3>
                    <ol style="margin: 10px 0; padding-left: 20px;">
                        <li>Meet with <strong>@{other_username}</strong> at your agreed location</li>
                        <li>Show them this OTP code on your phone</li>
                        <li>They will enter your OTP in their app</li>
                        <li>You will enter their OTP in your app</li>
                        <li>Once both OTPs are verified, the swap is complete! 🎉</li>
                    </ol>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong> Only share this OTP in person with @{other_username}. Never share it via text, email, or social media.
                </div>
                
                <div class="footer">
                    <p>This OTP is valid for this swap only.</p>
                    <p style="margin: 5px 0;">If you didn't request this swap, please ignore this email.</p>
                    <p style="margin: 15px 0 0 0;">
                        <strong>ReWearth</strong> - Sustainable Fashion Swaps<br>
                        Making fashion circular, one swap at a time 🌍
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        ReWearth - Your Swap OTP Code
        
        Hi {username},
        
        You're about to complete a swap with @{other_username} for {item_title}!
        
        Your OTP Code: {otp}
        
        How to use this OTP:
        1. Meet with @{other_username} at your agreed location
        2. Show them this OTP code
        3. They will enter your OTP in their app
        4. You will enter their OTP in your app
        5. Once both OTPs are verified, the swap is complete!
        
        Security Notice: Only share this OTP in person with @{other_username}.
        
        ReWearth - Sustainable Fashion Swaps
        """
        
        params = {
            "from": settings.EMAIL_FROM,
            "to": [to_email],
            "subject": f"🌱 Your ReWearth Swap OTP: {otp}",
            "html": html_content,
            "text": text_content,
        }
        
        email = resend.Emails.send(params)
        print(f"✅ OTP email sent to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send OTP email to {to_email}: {str(e)}")
        return False


def send_swap_notification(to_email: str, username: str, notification_type: str, **kwargs) -> bool:
    """
    Send various swap notifications
    
    Args:
        to_email: Recipient email
        username: Recipient username
        notification_type: Type of notification (swap_request, swap_accepted, meeting_proposed, etc.)
        **kwargs: Additional data for the notification
    
    Returns:
        bool: True if sent successfully
    """
    if not settings.RESEND_API_KEY:
        print(f"⚠️  Email not configured. Notification for {username}: {notification_type}")
        return False
    
    try:
        subject = ""
        message = ""
        
        if notification_type == "swap_request":
            subject = f"🔔 New Swap Request for {kwargs.get('item_title')}"
            message = f"@{kwargs.get('requester_username')} wants to swap for your item!"
            
        elif notification_type == "swap_accepted":
            subject = f"✅ Swap Accepted for {kwargs.get('item_title')}"
            message = f"@{kwargs.get('owner_username')} accepted your swap request!"
            
        elif notification_type == "meeting_proposed":
            subject = f"📅 Meeting Proposed for Swap"
            message = f"@{kwargs.get('proposer_username')} proposed a meeting at {kwargs.get('location')} on {kwargs.get('time')}"
            
        elif notification_type == "swap_completed":
            subject = f"🎉 Swap Completed!"
            message = f"Your swap with @{kwargs.get('other_username')} is complete!"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 30px; border-radius: 12px;">
                <h2 style="color: #10b981;">🌱 ReWearth</h2>
                <h3>{subject}</h3>
                <p>Hi {username},</p>
                <p>{message}</p>
                <p style="margin-top: 30px;">
                    <a href="http://localhost:3000" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                        View in App
                    </a>
                </p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                    ReWearth - Sustainable Fashion Swaps
                </p>
            </div>
        </body>
        </html>
        """
        
        params = {
            "from": settings.EMAIL_FROM,
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        }
        
        resend.Emails.send(params)
        print(f"✅ Notification email sent to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send notification to {to_email}: {str(e)}")
        return False
