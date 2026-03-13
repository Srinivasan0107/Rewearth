# 🚀 Deploy Frontend NOW - Step by Step

## Quick Steps (5 minutes)

### 1. Open Railway Dashboard
Click this link: https://railway.com/project/c1808037-b4f4-409c-b88a-c814464d0dc7

### 2. Add New Service
- Click the **"+ New"** button (top right or in the canvas)
- Select **"GitHub Repo"**
- Choose **"Srinivasan0107/Rewearth"** repository
- Click **"Add Service"** or **"Deploy"**

### 3. Configure Service Settings
Once the service is created, click on it and go to **Settings**:

**Service Name** (optional, but helpful):
```
frontend
```

**Root Directory** (IMPORTANT):
```
frontend
```

**Custom Build Command** (optional, Railway auto-detects):
```
npm run build
```

**Custom Start Command** (optional, Railway auto-detects):
```
npm start
```

### 4. Add Environment Variables
Click on the **Variables** tab and add these three variables:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://thzapvupdalwtdlhgfve.supabase.co
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemFwdnVwZGFsd3RkbGhnZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkwNzYsImV4cCI6MjA4OTAwNTA3Nn0.71ayDcE-y3RvAroR99pfnblDx_iR57TcGmyeYtfjcOo
```

**Variable 3:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://rewearth-production.up.railway.app
```

### 5. Generate Public Domain
- Go to **Settings** tab
- Scroll to **Networking** section
- Click **"Generate Domain"**
- Copy the URL (something like `frontend-production-xxxx.up.railway.app`)

### 6. Wait for Deployment
- Go to **Deployments** tab
- Watch the build logs
- Wait for status to show **"Success"** or **"Active"**

### 7. Update Backend CORS
Now update your backend to allow the new frontend:

1. Click on your **backend service** (named "rewearth")
2. Go to **Variables** tab
3. Find `FRONTEND_URL` or add it:
```
Name: FRONTEND_URL
Value: https://your-new-frontend-url.up.railway.app
```
4. The backend will auto-redeploy

### 8. Test Your App! 🎉
Open your new frontend URL and test:
- Home page loads
- Login works
- Marketplace shows items
- Chat functionality works

---

## 📸 Visual Guide

**Step 2 - Add Service:**
```
┌─────────────────────────────────────┐
│  Railway Dashboard                  │
│                                     │
│  [+ New] ← Click here              │
│                                     │
│  Options:                           │
│  • Empty Service                    │
│  • Database                         │
│  • GitHub Repo  ← Choose this      │
│  • Docker Image                     │
└─────────────────────────────────────┘
```

**Step 3 - Settings:**
```
┌─────────────────────────────────────┐
│  Service Settings                   │
│                                     │
│  Root Directory: frontend           │
│  Build Command: npm run build       │
│  Start Command: npm start           │
└─────────────────────────────────────┘
```

**Step 4 - Variables:**
```
┌─────────────────────────────────────┐
│  Environment Variables              │
│                                     │
│  NEXT_PUBLIC_SUPABASE_URL          │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY     │
│  NEXT_PUBLIC_API_URL               │
└─────────────────────────────────────┘
```

---

## ⚠️ Common Issues

### Build Fails with "Cannot find module"
- Make sure Root Directory is set to `frontend`
- Check that all dependencies are in `frontend/package.json`

### Environment Variables Not Working
- They must start with `NEXT_PUBLIC_` for Next.js
- Redeploy after adding variables

### 404 or Blank Page
- Check deployment logs for errors
- Verify the domain was generated correctly
- Try clearing browser cache

### CORS Errors
- Make sure you updated backend `FRONTEND_URL`
- Backend must be redeployed after variable change

---

## 🎯 Expected Result

After completing these steps, you'll have:

✅ Backend running at: `https://rewearth-production.up.railway.app`
✅ Frontend running at: `https://your-frontend-url.up.railway.app`
✅ Both services in the same Railway project
✅ Frontend can communicate with backend
✅ Full app functionality working

---

## 🆘 Need Help?

If you get stuck:
1. Check the deployment logs in Railway dashboard
2. Verify all environment variables are set correctly
3. Make sure Root Directory is `frontend`
4. Try redeploying the service

The deployment usually takes 2-5 minutes. Watch the logs to see progress!
