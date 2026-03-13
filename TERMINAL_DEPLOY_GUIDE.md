# 🚀 Terminal Deployment Guide - Simple Steps

Your frontend is already linked to Vercel! Let's finish the deployment.

---

## ✅ What's Already Done

- ✅ Vercel CLI installed
- ✅ Logged into Vercel
- ✅ Project linked: `rewearth-thewalkingdevs`
- ✅ Environment variables downloaded

---

## 🔧 Step 1: Update Environment Variables in Vercel Dashboard

The CLI had an error, so let's finish in the dashboard:

1. **Go to**: https://vercel.com/srinivasan1080s-projects/rewearth-thewalkingdevs

2. **Click "Settings"** → **"Environment Variables"**

3. **Update `NEXT_PUBLIC_API_URL`**:
   - Find the variable `NEXT_PUBLIC_API_URL`
   - Click "Edit"
   - Change from: `http://localhost:8000`
   - Change to: `https://rewearth-api.onrender.com` (or your backend URL)
   - Select: Production, Preview, Development
   - Click "Save"

4. **Verify other variables exist**:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://thzapvupdalwtdlhgfve.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🚀 Step 2: Deploy Frontend

### Option A: Via Dashboard (Easiest)
1. Go to your project: https://vercel.com/srinivasan1080s-projects/rewearth-thewalkingdevs
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. Wait 2-3 minutes

### Option B: Via Terminal
```bash
cd frontend
vercel --prod
```

If you get an error, just use Option A (dashboard).

---

## 🐍 Step 3: Deploy Backend to Render

Since Vercel CLI had issues, let's use Render's dashboard for backend:

1. **Go to**: https://render.com

2. **Sign up/Login** with GitHub

3. **Click "New +" → "Web Service"**

4. **Connect Repository**: `Srinivasan0107/Rewearth`

5. **Configure**:
   ```
   Name: rewearth_api
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

6. **Add Environment Variables**:
   ```
   DATABASE_URL = postgresql://postgres:8UoSh23gaBCuEqgl@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   SUPABASE_URL = https://thzapvupdalwtdlhgfve.supabase.co
   SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkwNzYsImV4cCI6MjA4OTAwNTA3Nn0.71ayDcE-y3RvAroR99pfnblDx_iR57TcGmyeYtfjcOo
   SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyOTA3NiwiZXhwIjoyMDg5MDA1MDc2fQ.D9_SwSZYaZIjiJQTKqVQcUaKOFmkorUPCyJhnhiLM4Y
   FRONTEND_URL = https://rewearth-thewalkingdevs.vercel.app
   ```

7. **Click "Create Web Service"**

8. **Wait 3-5 minutes** for deployment

9. **Copy your backend URL**: Something like `https://rewearth-api.onrender.com`

---

## 🔄 Step 4: Update Frontend with Backend URL

1. **Go back to Vercel**: https://vercel.com/srinivasan1080s-projects/rewearth-thewalkingdevs

2. **Settings → Environment Variables**

3. **Edit `NEXT_PUBLIC_API_URL`**:
   - Change to your Render backend URL
   - Example: `https://rewearth-api.onrender.com`

4. **Redeploy frontend** (Deployments → Redeploy)

---

## 🔐 Step 5: Update Supabase & Google OAuth

### Supabase
1. Go to: https://supabase.com/dashboard
2. Select project: `thzapvupdalwtdlhgfve`
3. Authentication → URL Configuration
4. Update:
   - Site URL: `https://rewearth-thewalkingdevs.vercel.app`
   - Redirect URLs: `https://rewearth-thewalkingdevs.vercel.app/**`

### Google OAuth
1. Go to: https://console.cloud.google.com
2. APIs & Services → Credentials
3. Click your OAuth 2.0 Client
4. Add Authorized JavaScript origins:
   - `https://rewearth-thewalkingdevs.vercel.app`
5. Verify Authorized redirect URIs has:
   - `https://thzapvupdalwtdlhgfve.supabase.co/auth/v1/callback`

---

## ✅ Step 6: Test Your App!

1. **Visit**: https://rewearth-thewalkingdevs.vercel.app

2. **Test**:
   - ✅ Sign in with Google
   - ✅ Upload an item
   - ✅ Browse marketplace
   - ✅ Create a swap
   - ✅ Send messages

---

## 🎉 You're Live!

Your URLs:
- **Frontend**: https://rewearth-thewalkingdevs.vercel.app
- **Backend**: https://rewearth-api.onrender.com (or your URL)

---

## 🐛 Troubleshooting

**Vercel CLI errors?**
- Just use the dashboard instead
- The CLI sometimes has issues, dashboard always works

**Backend not responding?**
- Render free tier sleeps after 15 min
- First request takes ~30 seconds to wake up
- Check logs in Render dashboard

**Can't connect to backend?**
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Verify `FRONTEND_URL` in Render
- Check CORS settings in backend

---

**Need help?** Check the logs:
- Vercel: Dashboard → Deployments → Function Logs
- Render: Dashboard → Logs tab
