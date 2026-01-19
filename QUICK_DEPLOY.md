# 🚀 Quick Backend Deployment (5 Minutes)

## ⚠️ GitHub Pages Limitation

**GitHub Pages CANNOT run backend servers!** You need to deploy the backend separately.

---

## ✅ Fastest Solution: Render.com (Free)

### Step 1: Sign Up & Connect

1. Go to **[Render.com](https://render.com)** and sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and authorize Render
4. Select repository: **`vishal1412/PropScan`**

### Step 2: Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `propscan-backend` (or any name) |
| **Region** | Choose nearest to you |
| **Branch** | `gh-pages` |
| **Root Directory** | `.` (dot) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/api-server.js` |
| **Instance Type** | `Free` |

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. Copy your service URL (e.g., `https://propscan-backend.onrender.com`)

### Step 4: Update Frontend

1. **Create `.env` file** in `src/` folder:
   ```bash
   VITE_API_URL=https://propscan-backend.onrender.com/api
   ```
   *(Replace with YOUR Render URL)*

2. **Rebuild frontend**:
   ```powershell
   cd src
   npm run build
   ```

3. **Deploy to GitHub Pages**:
   ```powershell
   cd ..
   Copy-Item -Path "src/dist/*" -Destination "." -Recurse -Force
   git add .
   git commit -m "Connect to Render backend"
   git push origin gh-pages
   ```

### Step 5: Test

1. Wait 1-2 minutes for GitHub Pages to update
2. Visit: **https://vishal1412.github.io/PropScan/admin**
3. Try the **Import** feature - should work now! ✅

---

## 🧪 Test Your Backend

Open browser console on your site and run:

```javascript
fetch('https://YOUR-RENDER-URL.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log);
```

Should see: `{ status: 'ok', message: '...' }`

---

## ⚡ Important Notes

### Free Tier Limitations (Render)
- ⚠️ Backend sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds (cold start)
- ⚠️ 750 hours/month free (enough for testing)

### Solution for Cold Starts
Add this to keep backend alive (optional):

**UptimeRobot** - Ping your backend every 5 minutes:
1. Sign up at [UptimeRobot.com](https://uptimerobot.com) (free)
2. Add monitor: `https://YOUR-RENDER-URL.onrender.com/api/health`
3. Check interval: 5 minutes
4. Backend stays awake!

---

## 🐛 Troubleshooting

### Error: "405 Method Not Allowed"
- ✅ Backend not deployed yet
- ✅ Check `.env` file has correct URL
- ✅ Rebuild frontend after updating `.env`

### Error: "Network request failed"
- ✅ Backend is sleeping (wait 60 seconds)
- ✅ Check backend logs on Render dashboard
- ✅ Test backend URL directly in browser

### Import feature not working
1. Check browser console for errors
2. Verify backend URL in console: "API Base URL: ..."
3. Test health endpoint: `https://YOUR-URL.onrender.com/api/health`
4. Check Render logs for errors

---

## 🎯 Alternative: Local Backend (Development)

For local testing only:

1. **Start backend** (Terminal 1):
   ```powershell
   cd src
   npm install
   node api-server.js
   ```

2. **Start frontend** (Terminal 2):
   ```powershell
   cd src
   npm run dev
   ```

3. **Access**: http://localhost:5173

⚠️ **This won't work with GitHub Pages** - only for local development!

---

## 📊 What Works Where

| Feature | GitHub Pages | With Backend |
|---------|--------------|--------------|
| View properties | ✅ | ✅ |
| Browse projects | ✅ | ✅ |
| Contact forms | ✅ | ✅ |
| Resale listings | ✅ | ✅ |
| **Admin - Import** | ❌ | ✅ |
| **Admin - Add/Edit** | ❌ | ✅ |
| **Image Download** | ❌ | ✅ |
| **Data Management** | ❌ | ✅ |

---

## 💡 Need Help?

1. **Check backend logs** on Render dashboard
2. **Test health endpoint** in browser
3. **Look for console errors** in browser DevTools
4. **Verify .env file** has correct URL

---

## 🎉 Summary

1. Deploy backend to Render.com (5 minutes)
2. Get backend URL
3. Update `.env` file
4. Rebuild & deploy frontend
5. Import feature works! ✅

**Your backend URL**: `https://[your-service-name].onrender.com`
**Frontend URL**: `https://vishal1412.github.io/PropScan`
