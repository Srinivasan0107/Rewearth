# 🚀 Deploy Frontend to Railway

## Current Status
- Backend is deployed at: `https://rewearth-production.up.railway.app`
- Frontend needs to be deployed as a separate service

## Option 1: Railway Dashboard (Recommended - Easiest)

### Step 1: Open Your Railway Project
Go to: https://railway.com/project/c1808037-b4f4-409c-b88a-c814464d0dc7

### Step 2: Create New Service
1. Click the **"+ New"** button
2. Select **"GitHub Repo"**
3. Choose: **Srinivasan0107/Rewearth**
4. This creates a second service in the same project

### Step 3: Configure the Frontend Service
1. Click on the newly created service
2. Go to **Settings** tab
3. Set these configurations:

**Root Directory:**
```
frontend
```

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm start
```

**Watch Paths:**
```
frontend/**
```

### Step 4: Add Environment Variables
In the **Variables** tab, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://thzapvupdalwtdlhgfve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkwNzYsImV4cCI6MjA4OTAwNTA3Nn0.71ayDcE-y3RvAroR99pfnblDx_iR57TcGmyeYtfjcOo
NEXT_PUBLIC_API_URL=https://rewearth-production.up.railway.app
```

### Step 5: Generate Domain
1. Go to **Settings** tab
2. Scroll to **Networking** section
3. Click **"Generate Domain"**
4. Copy the generated URL (e.g., `rewearth-frontend.up.railway.app`)

### Step 6: Update Backend CORS
The backend needs to allow requests from the new frontend URL.

Update backend environment variable:
1. Click on your backend service (rewearth)
2. Go to **Variables** tab
3. Update or add:
```
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

### Step 7: Redeploy Backend
After updating CORS, redeploy the backend:
1. Click on backend service
2. Go to **Deployments** tab
3. Click **"Redeploy"** on the latest deployment

---

## Option 2: Use Vercel (Alternative)

Since you already have Vercel set up, you can fix the existing deployment:

### Step 1: Update Environment Variables
Go to: https://vercel.com/srinivasan1080s-projects/rewearth-thewalkingdevs/settings/environment-variables

Make sure these are set for **Production**:
```
NEXT_PUBLIC_SUPABASE_URL=https://thzapvupdalwtdlhgfve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkwNzYsImV4cCI6MjA4OTAwNTA3Nn0.71ayDcE-y3RvAroR99pfnblDx_iR57TcGmyeYtfjcOo
NEXT_PUBLIC_API_URL=https://rewearth-production.up.railway.app
```

### Step 2: Remove vercel.json (if it exists)
The error mentioned secret references. Let's check:

```bash
cd frontend
# If vercel.json exists, remove it
rm vercel.json
git add .
git commit -m "fix: Remove vercel.json"
git push
```

### Step 3: Redeploy
Vercel will auto-deploy on push, or manually:
1. Go to Deployments tab
2. Click **"Redeploy"** on latest

---

## Option 3: Railway CLI with Separate Service

### Step 1: Create Service via CLI
```bash
# From root directory
railway service create frontend-rewearth
```

### Step 2: Link to Frontend Service
```bash
railway service link frontend-rewearth
```

### Step 3: Deploy from Frontend Directory
```bash
cd frontend
railway up
```

### Step 4: Set Variables
```bash
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://thzapvupdalwtdlhgfve.supabase.co"
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkwNzYsImV4cCI6MjA4OTAwNTA3Nn0.71ayDcE-y3RvAroR99pfnblDx_iR57TcGmyeYtfjcOo"
railway variables set NEXT_PUBLIC_API_URL="https://rewearth-production.up.railway.app"
```

### Step 5: Generate Domain
```bash
railway domain
```

---

## 🎯 Recommended Approach

**Use Option 1 (Railway Dashboard)** - it's the most straightforward and visual.

The key points:
1. Create a NEW service in the same Railway project
2. Point it to the `frontend` directory
3. Set environment variables
4. Generate a domain
5. Update backend CORS

---

## ✅ After Deployment

Once frontend is deployed, test these URLs:

1. **Frontend Home**: `https://your-frontend-url.up.railway.app`
2. **Frontend Login**: `https://your-frontend-url.up.railway.app/login`
3. **Backend Health**: `https://rewearth-production.up.railway.app/health`

---

## 🔧 Troubleshooting

### Build Fails
- Check that `frontend/package.json` has all dependencies
- Verify Node.js version compatibility
- Check build logs in Railway dashboard

### Environment Variables Not Working
- Make sure they start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check they're set for the correct environment (production)

### CORS Errors
- Update backend `FRONTEND_URL` variable
- Redeploy backend after updating
- Check backend allows the new frontend domain

---

## 📝 Current Configuration

**Backend Service:**
- Name: `rewearth`
- URL: `https://rewearth-production.up.railway.app`
- Root: `backend/`

**Frontend Service (to be created):**
- Name: `frontend-rewearth` (or similar)
- Root: `frontend/`
- Build: `npm run build`
- Start: `npm start`
