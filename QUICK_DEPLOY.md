# 🚀 Quick Deploy Guide - Get Live in 15 Minutes!

Follow these steps to deploy ReWearth to production quickly.

---

## Step 1: Deploy Backend (5 minutes)

### Using Render.com

1. **Go to [render.com](https://render.com)** and sign up with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect Repository**: Select `Srinivasan0107/Rewearth`

4. **Configure**:
   - Name: `rewearth-api`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Plan: **Free**

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   DATABASE_URL = postgresql://postgres:8UoSh23gaBCuEqgl@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   SUPABASE_URL = https://thzapvupdalwtdlhgfve.supabase.co
   SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkwNzYsImV4cCI6MjA4OTAwNTA3Nn0.71ayDcE-y3RvAroR99pfnblDx_iR57TcGmyeYtfjcOo
   SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyOTA3NiwiZXhwIjoyMDg5MDA1MDc2fQ.D9_SwSZYaZIjiJQTKqVQcUaKOFmkorUPCyJhnhiLM4Y
   ```

6. **Click "Create Web Service"** and wait 2-3 minutes

7. **Copy your backend URL**: `https://rewearth-api.onrender.com` (or similar)

---

## Step 2: Deploy Frontend (5 minutes)

### Using Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub

2. **Click "Add New..." → "Project"**

3. **Import**: Select `Srinivasan0107/Rewearth`

4. **Configure**:
   - Framework Preset: `Next.js` (auto-detected)
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT: Click "Edit" and set this!**
   - Build Command: `npm run build` (auto-detected)
   - Install Command: `npm install` (auto-detected)

5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://thzapvupdalwtdlhgfve.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkwNzYsImV4cCI6MjA4OTAwNTA3Nn0.71ayDcE-y3RvAroR99pfnblDx_iR57TcGmyeYtfjcOo
   NEXT_PUBLIC_API_URL = https://rewearth-api.onrender.com
   ```
   ⚠️ **Replace the API URL with YOUR backend URL from Step 1!**

6. **Click "Deploy"** and wait 2-3 minutes

7. **Copy your frontend URL**: `https://rewearth.vercel.app` (or similar)

---

## Step 3: Update Backend CORS (2 minutes)

1. **Go back to Render dashboard**

2. **Click on your `rewearth-api` service**

3. **Go to "Environment" tab**

4. **Add new environment variable**:
   ```
   FRONTEND_URL = https://rewearth.vercel.app
   ```
   ⚠️ **Use YOUR Vercel URL from Step 2!**

5. **Save** - Backend will auto-redeploy

---

## Step 4: Update Supabase (3 minutes)

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**

2. **Select your project**: `thzapvupdalwtdlhgfve`

3. **Go to Authentication → URL Configuration**

4. **Update**:
   - Site URL: `https://rewearth.vercel.app` (your Vercel URL)
   - Add Redirect URLs:
     - `https://rewearth.vercel.app/**`
     - `https://rewearth.vercel.app/auth/callback`

5. **Save**

---

## Step 5: Update Google OAuth (2 minutes)

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**

2. **Navigate to**: APIs & Services → Credentials

3. **Click on your OAuth 2.0 Client ID**

4. **Add Authorized JavaScript origins**:
   - `https://rewearth.vercel.app` (your Vercel URL)

5. **Authorized redirect URIs should have**:
   - `https://thzapvupdalwtdlhgfve.supabase.co/auth/v1/callback`

6. **Save**

---

## ✅ Test Your Deployment!

1. **Visit your app**: `https://rewearth.vercel.app`

2. **Test these features**:
   - ✅ Sign in with Google
   - ✅ Upload an item
   - ✅ Browse marketplace
   - ✅ Request a swap
   - ✅ Send messages
   - ✅ Complete swap with OTP

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

- **Frontend**: https://rewearth.vercel.app
- **Backend**: https://rewearth-api.onrender.com
- **Database**: Supabase (hosted)

### Share Your App:
- Add the URL to your GitHub repo description
- Share on social media
- Send to friends to test

---

## 🐛 Troubleshooting

**Backend not responding?**
- Check Render logs: Dashboard → Logs
- Verify all environment variables are set
- Wait 1-2 minutes for cold start (free tier)

**Frontend can't connect to backend?**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check `FRONTEND_URL` is set in backend
- Clear browser cache

**Google OAuth not working?**
- Verify redirect URIs in Google Console
- Check Supabase URL configuration
- Try incognito mode

---

## 💡 Pro Tips

1. **Free tier limitations**:
   - Render: Backend sleeps after 15 min inactivity (first request takes ~30 sec)
   - Vercel: 100 GB bandwidth/month
   - Supabase: 500 MB database, 1 GB storage

2. **Monitoring**:
   - Check Render logs for backend errors
   - Check Vercel logs for frontend errors
   - Monitor Supabase usage in dashboard

3. **Updates**:
   - Push to GitHub → Auto-deploys to both platforms
   - No manual deployment needed!

---

**Total Time**: ~15 minutes
**Cost**: $0 (free tier)

Enjoy your live app! 🚀🌿
