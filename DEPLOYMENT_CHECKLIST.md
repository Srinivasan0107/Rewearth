# 🚀 ReWearth Deployment Checklist

Quick checklist to deploy your app to production.

---

## ✅ Pre-Deployment Checklist

### Backend Preparation
- [ ] All environment variables documented in `.env.example`
- [ ] Database tables created in Supabase
- [ ] Supabase storage bucket "Rewearth" created and set to public
- [ ] CORS origins configured for production
- [ ] Health check endpoint working (`/health`)
- [ ] All dependencies in `requirements.txt`

### Frontend Preparation
- [ ] All environment variables documented in `.env.local.example`
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] API URL configurable via environment variable
- [ ] Google OAuth redirect URIs ready to update

---

## 🔧 Backend Deployment (Choose One)

### Option A: Render.com
1. [ ] Create account at render.com
2. [ ] Connect GitHub repository
3. [ ] Create new Web Service
4. [ ] Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. [ ] Add environment variables:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `RESEND_API_KEY`
   - `FRONTEND_URL` (will add after frontend deployment)
6. [ ] Deploy and wait for build
7. [ ] Test health endpoint: `https://your-app.onrender.com/health`
8. [ ] Copy backend URL for frontend configuration

### Option B: Railway.app
1. [ ] Create account at railway.app
2. [ ] Create new project from GitHub
3. [ ] Configure root directory: `backend`
4. [ ] Add environment variables (same as above)
5. [ ] Deploy and test

---

## 🌐 Frontend Deployment

### Vercel (Recommended)
1. [ ] Create account at vercel.com
2. [ ] Import GitHub repository
3. [ ] Configure:
   - Framework: Next.js
   - Root Directory: `frontend`
4. [ ] Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (use backend URL from above)
5. [ ] Deploy and wait for build
6. [ ] Copy frontend URL (e.g., `https://rewearth.vercel.app`)

---

## 🔄 Post-Deployment Configuration

### Update Backend CORS
1. [ ] Add `FRONTEND_URL` environment variable to backend
   - Value: Your Vercel URL (e.g., `https://rewearth.vercel.app`)
2. [ ] Redeploy backend (or it will auto-deploy)

### Update Supabase Settings
1. [ ] Go to Supabase Dashboard → Authentication → URL Configuration
2. [ ] Update Site URL: `https://rewearth.vercel.app`
3. [ ] Add Redirect URLs:
   - `https://rewearth.vercel.app/**`
   - `https://rewearth.vercel.app/auth/callback`

### Update Google OAuth
1. [ ] Go to Google Cloud Console
2. [ ] Update OAuth 2.0 Client:
   - Authorized JavaScript origins: `https://rewearth.vercel.app`
   - Authorized redirect URIs: `https://thzapvupdalwtdlhgfve.supabase.co/auth/v1/callback`

---

## 🧪 Testing

### Backend Tests
- [ ] Health check: `curl https://your-backend.onrender.com/health`
- [ ] List items: `curl https://your-backend.onrender.com/items/`
- [ ] Check logs for errors

### Frontend Tests
- [ ] Visit homepage
- [ ] Sign in with Google
- [ ] Upload an item to wardrobe
- [ ] Browse marketplace
- [ ] Request a swap
- [ ] Send messages in chat
- [ ] Test OTP generation and verification
- [ ] Check browser console for errors

---

## 📊 Monitoring Setup

### Backend
- [ ] Check Render/Railway logs
- [ ] Set up health check monitoring
- [ ] Configure error alerts

### Frontend
- [ ] Check Vercel deployment logs
- [ ] Enable Vercel Analytics (optional)
- [ ] Monitor Web Vitals

---

## 🎉 Launch!

- [ ] Share your app URL with friends
- [ ] Post on social media
- [ ] Add URL to GitHub repository description
- [ ] Update README with live demo link

---

## 🐛 Common Issues

**Backend won't start**
- Check environment variables are set correctly
- Review logs in Render/Railway dashboard
- Verify database connection string

**Frontend can't connect to backend**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration in backend
- Ensure backend is running

**Google OAuth fails**
- Update redirect URIs in Google Console
- Update Supabase URL configuration
- Clear browser cache

**Images won't upload**
- Check Supabase storage bucket exists
- Verify bucket is public
- Check `SUPABASE_SERVICE_KEY` in backend

---

## 📝 Environment Variables Reference

### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://thzapvupdalwtdlhgfve.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_...
FRONTEND_URL=https://rewearth.vercel.app
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://thzapvupdalwtdlhgfve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=https://rewearth-api.onrender.com
```

---

**Estimated Time**: 30-45 minutes for complete deployment

Good luck! 🚀
