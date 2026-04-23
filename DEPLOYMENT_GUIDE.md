# 🚀 Deployment Guide - Student Portal

Complete beginner guide to deploy your app online.

---

## **EASIEST METHOD: Railway (Recommended for Beginners)**

Railway is the simplest option—you connect GitHub and it deploys automatically!

### **Step 1: Push Your Code to GitHub ✅** (Already Done!)
You've already done this. Your code is on GitHub at:
```
https://github.com/MrPenguin8847/Student-Portal
```

### **Step 2: Deploy Backend on Railway**

1. **Go to Railway.app**
   - Open: https://railway.app
   - Click **"Start Project"**
   - Click **"Deploy from GitHub"**
   - Connect your GitHub account (if not already connected)

2. **Select Your Repository**
   - Find `Student-Portal`
   - Click it to select

3. **Configure Backend Service**
   - Railway detects it's a Node.js project
   - **Root Directory:** `server` (important!)
   - Railway auto-detects the start command

4. **Add Environment Variable**
   - In Railway dashboard, go to **Variables**
   - Add:
     ```
     PORT=3000
     NODE_ENV=production
     ```
   - (Railway will auto-assign PORT anyway, but let's be explicit)

5. **Deploy**
   - Click the **Deploy** button
   - Wait 2-5 minutes for deployment
   - You'll get a URL like: `https://studentportal-prod.up.railway.app`
   - **COPY THIS URL** - you'll need it for frontend

---

### **Step 3: Deploy Frontend on Railway (Same Project)**

1. **In the same Railway project**, click **Add Service**
2. **Select GitHub** again
3. **Select the same repository** (`Student-Portal`)
4. **Configure Frontend Service**
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run preview` (or Railway might detect automatically)

5. **Add Environment Variables**
   - Go to **Variables** for the frontend service
   - Add:
     ```
     VITE_API_URL=https://studentportal-prod.up.railway.app/api
     ```
     (Replace the URL with your BACKEND URL from Step 2)

6. **Deploy**
   - Click Deploy
   - Wait 2-5 minutes
   - You'll get a frontend URL like: `https://studentportal-frontend.up.railway.app`
   - **This is your live website!** 🎉

---

## **ALTERNATIVE: Vercel (Frontend) + Render (Backend)**

### **Deploy Backend on Render**

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Connect GitHub repository
4. Select `Student-Portal` → **Connect**
5. Fill in:
   - **Name:** `student-portal-backend`
   - **Root Directory:** `server`
   - **Start Command:** `node index.js`
   - **Build Command:** `npm install`
   - **Environment:** Node
6. Scroll down → **Add Environment Variable:**
   - Key: `FRONTEND_URL`
   - Value: (Leave empty for now, update after deploying frontend)
7. Click **Create Web Service**
8. Wait 5-10 minutes. Your backend URL will appear at the top.

### **Deploy Frontend on Vercel**

1. Go to https://vercel.com
2. Click **New Project**
3. **Import Git Repository** → Select `Student-Portal`
4. **Framework Preset:** React
5. **Root Directory:** `client`
6. **Build Command:** `npm run build`
7. **Install Command:** `npm install`
8. **Output Directory:** `dist`
9. Click **Environment Variables**
10. Add:
    - **Name:** `VITE_API_URL`
    - **Value:** `https://your-render-backend-url.onrender.com/api`
11. Click **Deploy**
12. Wait 3-5 minutes. Your frontend URL appears!

---

## **Testing Your Deployment**

### **Admin Login**
```
Username: admin2024
Password: admin2024
```

### **Student Login**
```
Username: 701/24
Password: student123
```

---

## **Common Issues & Fixes**

### **Frontend can't reach backend (CORS Error)**
- Make sure `VITE_API_URL` environment variable is set correctly
- The URL should be the deployed backend URL
- Redeploy frontend after changing the variable

### **Backend not starting**
- Check Railway/Render logs for errors
- Make sure `server/package.json` has all dependencies
- Try: `npm install` in the `server/` folder locally first

### **Database errors**
- SQLite database is created on first run
- Check that `server/database.js` is working locally first
- For production, consider migrating to PostgreSQL (Railway offers free tier)

---

## **After Deployment: What's Next?**

1. ✅ Your app is live!
2. 📝 Update your GitHub README with the live URL
3. 🔒 Consider adding:
   - Better password hashing (bcrypt instead of plain text)
   - JWT tokens for authentication
   - Database backups
   - HTTPS/SSL (most platforms include this)

---

## **Need Help?**

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs

Good luck! 🚀
