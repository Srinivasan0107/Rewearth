#!/bin/bash

echo "🌱 ReWearth Email Setup"
echo "======================="
echo ""

# Check if in backend directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "   cd backend && bash ../setup_email.sh"
    exit 1
fi

echo "📦 Installing email dependencies..."
pip install resend==0.8.0

echo ""
echo "✅ Email package installed!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Sign up for Resend at https://resend.com (free for 3,000 emails/month)"
echo "2. Get your API key from the Resend dashboard"
echo "3. Add to your .env file:"
echo "   RESEND_API_KEY=re_your_api_key_here"
echo "   EMAIL_FROM=ReWearth <noreply@yourdomain.com>"
echo ""
echo "4. Restart your backend server:"
echo "   python -m uvicorn main:app --reload"
echo ""
echo "📖 For detailed instructions, see EMAIL_SETUP.md"
echo ""
echo "💡 Tip: If you don't configure email, OTPs will print to console"
echo ""
