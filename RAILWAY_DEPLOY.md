# 🚂 Deploy Backend to Railway - Simple Steps

You're already logged in and have a project created! Let's finish the deployment.

---

## ✅ What's Done

- ✅ Railway CLI installed
- ✅ Logged in as: srinivasan.sai2006@gmail.com
- ✅ Project created: `rewearth`
- ✅ Project URL: https://railway.com/project/c1808037-b4f4-409c-b88a-c814464d0dc7

---

## 🚀 Complete Deployment in Dashboard

The CLI created the project but we need to configure it. Let's use the dashboard:

### Step 1: Open Your Project

1. Go to: https://railway.com/project/c1808037-b4f4-409c-b88a-c814464d0dc7

2. You should see your `rewearth` project

### Step 2: Connect GitHub Repository

1. Click **"+ New"** → **"GitHub Repo"**

2. Select: **`Srinivasan0107/Rewearth`**

3. Railway will detect it's a Python project

### Step 3: Configure the Service

1. Click on the service that was created

2. Go to **"Settings"** tab

3. **Root Directory**:
   - Click "Edit"
   - Set to: `backend`
   - Save

4. **Start Command**:
   - Click "Edit" 
   - Set to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Save

5. **Build Command** (optional):
   - Should auto-detect: `pip install -r requirements.txt`

### Step 4: Add Environment Variables

1. Go to **"Variables"** tab

2. Click **"+ New Variable"** and add each:

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

### Step 5: Deploy

1. Go to **"Deployments"** tab

2. Click **"Deploy"** or it will auto-deploy

3. Wait 2-3 minutes for build to complete

4. Once deployed, go to **"Settings"** → **"Networking"**

5. Click **"Generate Domain"** to get a public URL

6. **Copy your backend URL**: Something like `https://rewearth-production.up.railway.app`

---

## ✅ Backend is Live!

Your backend URL: `https://rewearth-production.up.railway.app` (or similar)

Test it:
```bash
curl https://your-backend-url.railway.app/health
```

Should return: `{"status":"ok","service":"ReWearth API"}`

---

## 🔄 Next: Update Frontend

Now that backend is deployed, update your frontend:

1. Go to Vercel: https://vercel.com/srinivasan1080s-projects/rewearth-thewalkingdevs/settings/environment-variables

2. Edit `NEXT_PUBLIC_API_URL`:
   - Change to your Railway backend URL
   - Example: `https://rewearth-production.up.railway.app`

3. Redeploy frontend:
   - Go to Deployments tab
   - Click "Redeploy"

---

## 🎉 Both Deployed!

- **Frontend**: https://rewearth-thewalkingdevs.vercel.app
- **Backend**: https://rewearth-production.up.railway.app

---

## 💡 Railway Benefits

- ✅ Free $5 credit per month
- ✅ No sleep/cold starts (unlike Render)
- ✅ Faster deployments
- ✅ Better performance
- ✅ Auto-deploys on git push

---

## 🐛 Troubleshooting

**Build failed?**
- Check "Deployments" → "View Logs"
- Verify root directory is set to `backend`
- Verify start command is correct

**Can't access backend?**
- Make sure you generated a public domain
- Check environment variables are set
- View logs for errors

**Out of credits?**
- Railway gives $5/month free
- Backend uses ~$3-4/month
- Add payment method for more credits

---

That's it! Your backend is deployed on Railway! 🚂
