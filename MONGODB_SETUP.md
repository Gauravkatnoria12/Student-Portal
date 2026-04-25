# MongoDB Setup Guide - QUICK START (2 Minutes)

## Step 1: Create Free MongoDB Account
Go to: https://www.mongodb.com/cloud/atlas/register

Click **Sign Up** and fill in:
- Email
- Password
- Agree to terms
- Click **Create account**

(It's free forever for the basic tier)

---

## Step 2: Create Your First Cluster
1. After signing up, click **Create** button
2. Select **Free** (M0 Cluster - it's free)
3. Click **Create Cluster** (takes 1-2 minutes)
4. Wait for it to say "Cluster Ready"

---

## Step 3: Get Your Connection String
1. Click **Connect** button (top right, on your cluster)
2. Choose **Drivers**
3. Select **Node.js** and **version 5.5 or later**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 4: Update Your .env File
Go to `e:\Forks\Student-Portal\server\.env` and add this line:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-portal?retryWrites=true&w=majority
```

Replace `username:password` with your actual MongoDB credentials.

---

## Step 5: Run Your Server
```powershell
cd e:\Forks\Student-Portal\server
node index.js
```

You should see:
```
Connected to MongoDB
Admin user created
Server running on port 5000
```

---

## That's It! 🎉

Your database is now running in the cloud and your app will work perfectly.
