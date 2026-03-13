# 🚀 Deploy Frontend + Backend Together

Deploy both your frontend and backend as a single application on Railway.

---

## 🎯 Option 1: Fix Current Deployment (Recommended)

Your backend is working on Railway, but frontend has issues. Let's fix Vercel:

### Step 1: Check Vercel Dashboard

1. Go to: https://vercel.com/srinivasan1080s-projects/rewearth-thewalkingdevs

2. Check the latest deployment status

3. If it shows errors, click on the deployment to see logs

### Step 2: Verify Environment Variables

1. Go to: Settings → Environment Variables

2. Make sure these are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://thzapvupdalwtdlhgfve.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_API_URL = https://rewearth-production.up.railway.app
   ```

### Step 3: Redeploy

1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Wait for completion

---

## 🎯 Option 2: Deploy Both on Railway (Alternative)

If Vercel keeps having issues, deploy everything on Railway:

### Step 1: Create New Railway Service for Frontend

1. Go to: https://railway.com/project/c1808037-b4f4-409c-b88a-c814464d0dc7

2. Click "+ New" → "GitHub Repo"

3. Select: `Srinivasan0107/Rewearth` (again)

4. This will create a second service

### Step 2: Configure Frontend Service

1. Click on the new service

2. Go to Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://thzapvupdalwtdlhgfve.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_API_URL = https://rewearth-production.up.railway.app
   ```

4. Generate Domain for frontend

### Step 3: Update Backend CORS

Update your backend to allow the new frontend URL:

```bash
railway variables set FRONTEND_URL="https://your-new-frontend-url.up.railway.app"
```

---

## 🎯 Option 3: Single Railway Service (Advanced)

Deploy both as one service using a reverse proxy:

### Step 1: Create Dockerfile

Create `Dockerfile` in root:

```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS backend
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install -r requirements.txt
COPY backend/ ./

# Copy frontend build
COPY --from=frontend-build /app/frontend/.next ./frontend/.next
COPY --from=frontend-build /app/frontend/public ./frontend/public
COPY --from=frontend-build /app/frontend/package.json ./frontend/

# Install Node.js for serving frontend
RUN apt-get update && apt-get install -y nodejs npm
WORKDIR /app/frontend
RUN npm install --production

# Start script
WORKDIR /app
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 3000
CMD ["./start.sh"]
```

### Step 2: Create Start Script

Create `start.sh`:

```bash
#!/bin/bash
# Start backend
cd /app && uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start frontend
cd /app/frontend && npm start --port 3000 &

# Wait for both
wait
```

---

## 🎯 Quick Fix (Try This First)

The 404 error might be a temporary issue. Try:

1. **Clear browser cache** (Ctrl+Shift+R)

2. **Try incognito mode**

3. **Wait 5 minutes** and try again

4. **Check if this URL works**: https://rewearth-thewalkingdevs.vercel.app/login

---

## 🔍 Debug Steps

If still having issues:

1. **Check Vercel deployment logs**:
   - Go to Vercel dashboard
   - Click on latest deployment
   - Check build logs for errors

2. **Check if backend is working**:
   - Try: https://rewearth-production.up.railway.app/health
   - Should return: `{"status":"ok","service":"ReWearth API"}`

3. **Check environment variables**:
   - Make sure `NEXT_PUBLIC_API_URL` points to Railway backend

---

## 💡 Recommendation

**Try Option 1 first** (fix current Vercel deployment) - it's the simplest and most reliable approach. Only use Option 2 or 3 if Vercel continues to have issues.

Your backend is already working perfectly on Railway! 🚂✨