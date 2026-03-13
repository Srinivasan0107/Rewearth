# 🚂 Railway Dashboard Setup - Final Steps

The CLI deployment is having issues. Let's finish this in the Railway dashboard - it's actually easier!

---

## 🎯 Quick Fix in Railway Dashboard

### Step 1: Open Your Railway Project

Go to: **https://railway.com/project/c1808037-b4f4-409c-b88a-c814464d0dc7**

### Step 2: Configure the Service

1. **Click on your service** (should show "rewearth" or similar)

2. **Go to "Settings" tab**

3. **Set Root Directory**:
   - Find "Root Directory" section
   - Click "Edit"
   - Enter: `backend`
   - Click "Save"

4. **Set Start Command**:
   - Find "Start Command" section
   - Click "Edit"
   - Enter: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Click "Save"

5. **Set Build Command** (if needed):
   - Find "Build Command" section
   - Click "Edit"
   - Enter: `pip install -r requirements.txt`
   - Click "Save"

### Step 3: Add Environment Variables

1. **Go to "Variables" tab**

2. **Click "New Variable"** and add each one:

```
DATABASE_URL
postgresql://postgres:8UoSh23gaBCuEqgl@aws-0-ap-south-1.pooler.supabase.com:5432/postgres

SUPABASE_URL
https://thzapvupdalwtdlhgfve.supabase.co

SUPABASE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkwNzYsImV4cCI6MjA4OTAwNTA3Nn0.71ayDcE-y3RvAroR99pfnblDx_iR57TcGmyeYtfjcOo

SUPABASE_SERVICE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyOTA3NiwiZXhwIjoyMDg5MDA1MDc2fQ.D9_SwSZYaZIjiJQTKqVQcUaKOFmkorUPCyJhnhiLM4Y

FRONTEND_URL
https://rewearth-thewalkingdevs.vercel.app
```

### Step 4: Deploy

1. **Go to "Deployments" tab**

2. **Click "Deploy"** or it should auto-deploy after saving settings

3. **Wait 2-3 minutes** for build to complete

### Step 5: Get Your URL

1. **Go to "Settings" tab**

2. **Find "Networking" section**

3. **Click "Generate Domain"** if you don't have one

4. **Copy your backend URL**: Something like `https://rewearth-production-xxxx.up.railway.app`

---

## ✅ Test Your Backend

Once deployed, test it:

```bash
curl https://your-railway-url.up.railway.app/health
```

Should return:
```json
{"status":"ok","service":"ReWearth API"}
```

---

## 🔄 Next: Update Frontend

1. **Go to Vercel**: https://vercel.com/srinivasan1080s-projects/rewearth-thewalkingdevs/settings/environment-variables

2. **Edit `NEXT_PUBLIC_API_URL`**:
   - Change to your Railway URL
   - Example: `https://rewearth-production-xxxx.up.railway.app`

3. **Redeploy frontend**:
   - Go to Deployments tab
   - Click "Redeploy"

---

## 🎉 You're Done!

Your app will be live at:
- **Frontend**: https://rewearth-thewalkingdevs.vercel.app
- **Backend**: https://your-railway-url.up.railway.app

---

## 💡 Why Dashboard is Better

- ✅ Visual configuration
- ✅ Clear error messages
- ✅ Easy to debug
- ✅ One-click domain generation
- ✅ Real-time logs

The CLI sometimes has issues, but the dashboard always works! 🚂