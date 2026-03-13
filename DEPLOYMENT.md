# ReWearth Deployment Guide

Complete guide to deploy ReWearth frontend and backend to production.

---

## 🎯 Deployment Overview

- **Frontend**: Vercel (Next.js optimized, free tier)
- **Backend**: Render or Railway (Python FastAPI, free tier)
- **Database**: Supabase (already hosted)
- **Storage**: Supabase Storage (already configured)

---

## 📦 Part 1: Deploy Backend (FastAPI)

### Option A: Deploy to Render (Recommended)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Srinivasan0107/Rewearth`
   - Configure:
     - **Name**: `rewearth-api`
     - **Region**: Oregon (US West)
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free

3. **Add Environment Variables**
   
   Click "Environment" and add these variables:
   
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   SUPABASE_URL=https://thzapvupdalwtdlhgfve.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   RESEND_API_KEY=re_...
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your API will be at: `https://rewearth-api.onrender.com`

5. **Test the API**
   ```bash
   curl https://rewearth-api.onrender.com/health
   ```

### Option B: Deploy to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `Srinivasan0107/Rewearth`
   - Railway will auto-detect Python

3. **Configure Service**
   - Click on the service
   - Go to "Settings"
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   
   Go to "Variables" tab and add:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   SUPABASE_URL=https://thzapvupdalwtdlhgfve.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   RESEND_API_KEY=re_...
   ```

5. **Deploy**
   - Railway will auto-deploy
   - Your API will be at: `https://rewearth-api.up.railway.app`

---

## 🌐 Part 2: Deploy Frontend (Next.js)

### Deploy to Vercel (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import `Srinivasan0107/Rewearth`
   - Vercel will auto-detect Next.js

3. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://thzapvupdalwtdlhgfve.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_API_URL=https://rewearth-api.onrender.com
   ```
   
   ⚠️ **Important**: Replace `NEXT_PUBLIC_API_URL` with your actual backend URL from Step 1!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be at: `https://rewearth.vercel.app`

6. **Custom Domain (Optional)**
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

---

## 🔧 Part 3: Update CORS Settings

After deploying, update your backend CORS settings:

1. **Edit `backend/main.py`**:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://rewearth.vercel.app",  # Add your Vercel URL
        "https://your-custom-domain.com"  # Add custom domain if you have one
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Commit and push**:
```bash
git add backend/main.py
git commit -m "feat: Add production CORS origins"
git push origin main
```

3. **Redeploy backend** (Render/Railway will auto-deploy on push)

---

## 🔐 Part 4: Update Supabase OAuth Redirect URLs

1. **Go to Supabase Dashboard**
   - Navigate to **Authentication** → **URL Configuration**

2. **Add Production URLs**:
   - **Site URL**: `https://rewearth.vercel.app`
   - **Redirect URLs**: Add these:
     ```
     https://rewearth.vercel.app/**
     https://rewearth.vercel.app/auth/callback
     http://localhost:3000/**
     ```

3. **Update Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to your OAuth 2.0 Client
   - Add **Authorized redirect URIs**:
     ```
     https://thzapvupdalwtdlhgfve.supabase.co/auth/v1/callback
     ```
   - Add **Authorized JavaScript origins**:
     ```
     https://rewearth.vercel.app
     ```

---

## ✅ Part 5: Test Your Deployment

1. **Test Backend API**:
   ```bash
   curl https://rewearth-api.onrender.com/health
   curl https://rewearth-api.onrender.com/items/
   ```

2. **Test Frontend**:
   - Visit `https://rewearth.vercel.app`
   - Try signing in with Google
   - Upload an item
   - Create a swap
   - Test the chat feature

3. **Check Logs**:
   - **Render**: Dashboard → Logs
   - **Vercel**: Dashboard → Deployments → View Function Logs

---

## 🚀 Continuous Deployment

Both Vercel and Render/Railway support automatic deployments:

- **Push to GitHub** → Automatically deploys
- **Pull Request** → Creates preview deployment (Vercel)
- **Merge to main** → Deploys to production

---

## 📊 Monitoring & Logs

### Backend (Render)
- **Logs**: Dashboard → Logs tab
- **Metrics**: Dashboard → Metrics tab
- **Health Check**: Automatic (checks `/health` endpoint)

### Frontend (Vercel)
- **Analytics**: Dashboard → Analytics
- **Logs**: Dashboard → Deployments → Function Logs
- **Performance**: Automatic Web Vitals tracking

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Application failed to start"
- Check logs in Render/Railway dashboard
- Verify all environment variables are set
- Ensure `requirements.txt` is up to date

**Problem**: "Database connection failed"
- Verify `DATABASE_URL` is correct
- Check Supabase database is accessible
- Try using the pooler URL instead of direct connection

**Problem**: "CORS errors"
- Add your Vercel URL to `allow_origins` in `main.py`
- Redeploy backend after updating

### Frontend Issues

**Problem**: "API calls failing"
- Verify `NEXT_PUBLIC_API_URL` points to your backend
- Check backend is running and accessible
- Verify CORS is configured correctly

**Problem**: "Google OAuth not working"
- Update redirect URIs in Google Cloud Console
- Update Supabase URL configuration
- Clear browser cache and try again

**Problem**: "Images not uploading"
- Verify Supabase storage bucket exists
- Check bucket is set to public
- Verify `SUPABASE_SERVICE_KEY` is set in backend

---

## 💰 Cost Estimate

### Free Tier Limits

**Render (Backend)**:
- ✅ Free tier available
- 750 hours/month
- Sleeps after 15 min inactivity
- 512 MB RAM

**Vercel (Frontend)**:
- ✅ Free tier available
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

**Supabase (Database + Storage)**:
- ✅ Free tier available
- 500 MB database
- 1 GB storage
- 50,000 monthly active users

**Total Cost**: $0/month (within free tier limits)

---

## 🎉 You're Live!

Your ReWearth app is now deployed and accessible worldwide!

- **Frontend**: https://rewearth.vercel.app
- **Backend**: https://rewearth-api.onrender.com
- **Database**: Supabase (already hosted)

Share your app with friends and start swapping! 🌿👗

---

## 📝 Next Steps

1. **Custom Domain**: Add your own domain in Vercel
2. **Analytics**: Set up Google Analytics or Vercel Analytics
3. **Monitoring**: Add error tracking (Sentry)
4. **Email**: Configure custom email domain for OTP emails
5. **SEO**: Add meta tags and sitemap
6. **Performance**: Optimize images and enable caching

---

Need help? Check the logs or reach out for support!
