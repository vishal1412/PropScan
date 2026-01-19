# 🚀 Vercel Deployment Guide

## Quick Start - Deploy in 5 Minutes

### Prerequisites
- GitHub account with PropScan repository
- Vercel account (free tier)

---

## Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

---

## Step 2: Login to Vercel

```powershell
vercel login
```

Follow the browser prompts to authenticate.

---

## Step 3: Deploy Backend

From your project root:

```powershell
cd "c:\Users\Nisha Ashok\Documents\PropScan\PropScan"
vercel
```

**First-time deployment prompts:**
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N**
- Project name? → `propscan-backend` (or any name)
- Directory? → `.` (current directory)
- Override settings? → **N**

Vercel will:
1. Analyze your project
2. Detect the `api/` folder
3. Deploy serverless functions
4. Provide a URL like: `https://propscan-backend.vercel.app`

---

## Step 4: Production Deployment

```powershell
vercel --prod
```

Copy the production URL (e.g., `https://propscan-backend-abc123.vercel.app`)

---

## Step 5: Configure Frontend

Create `.env` file in `src/` directory:

```bash
VITE_API_URL=https://propscan-backend-abc123.vercel.app/api
```

**Replace with YOUR Vercel URL!**

---

## Step 6: Test Backend

Open your browser and test these endpoints:

### Health Check
```
https://your-vercel-url.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "PropScan API Server is running on Vercel",
  "timestamp": "2026-01-19T..."
}
```

### Properties
```
https://your-vercel-url.vercel.app/api/properties
```

### Test in Browser Console
```javascript
fetch('https://your-vercel-url.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log);
```

---

## Step 7: Rebuild & Deploy Frontend

```powershell
# Build frontend
cd src
npm run build

# Copy to root
cd ..
Copy-Item -Path "src/dist/*" -Destination "." -Recurse -Force

# Commit and push
git add .
git commit -m "Connect to Vercel backend"
git push origin gh-pages
```

---

## Step 8: Verify Everything Works

1. Wait 1-2 minutes for GitHub Pages to update
2. Visit: https://vishal1412.github.io/PropScan/admin
3. Try the **Import** feature
4. Should work! ✅

---

## 📊 API Endpoints Available

All endpoints are now available at:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/properties` | GET, POST, PUT, DELETE | Properties CRUD |
| `/api/testimonials` | GET, POST, PUT, DELETE | Testimonials CRUD |
| `/api/leads` | GET, POST, DELETE | Leads management |
| `/api/resale-properties` | GET, POST, PUT, DELETE | Resale properties |
| `/api/projects/extract` | POST | Web scraping/extraction |
| `/api/validate-images` | POST | Image URL validation |

---

## 🎯 Vercel Dashboard

Access your deployment at: https://vercel.com/dashboard

**Features:**
- ✅ Real-time logs
- ✅ Deployment history
- ✅ Analytics
- ✅ Environment variables
- ✅ Custom domains

---

## ⚙️ Environment Variables (Optional)

If you need to set environment variables:

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add variables (e.g., API keys)

---

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to GitHub:

1. Make code changes
2. Commit and push to GitHub
3. Vercel auto-deploys (1-2 minutes)
4. No manual deployment needed!

**Configure Git integration:**
```powershell
vercel git connect
```

---

## 📝 Update Backend Code

When you update API code:

```powershell
# Make changes to files in api/ folder
git add .
git commit -m "Update API"
git push

# Or manual deploy:
vercel --prod
```

---

## 🐛 Troubleshooting

### Error: Function execution timed out
- Vercel free tier has 10s timeout
- Extraction might take longer
- Solution: Use Vercel Pro ($20/mo) for 60s timeout
- Or optimize extraction code

### Error: CORS issues
- Check `Access-Control-Allow-Origin` in API files
- Should be set to `*` or your GitHub Pages domain

### Error: Cannot find module
- Install dependencies: `npm install`
- Ensure `package.json` is in root directory

### Error: 404 on API calls
- Check `.env` has correct Vercel URL
- Rebuild frontend after updating `.env`
- Verify route in `vercel.json`

---

## 💾 File Storage Limitations

⚠️ **Important:** Vercel serverless functions have **NO persistent storage**

### What This Means:
- File writes (e.g., updating JSON files) work during request
- Files reset on next deployment
- Downloaded images don't persist

### Solutions:

#### Option 1: Use Vercel KV Storage (Redis)
```javascript
import { kv } from '@vercel/kv';

// Store data
await kv.set('properties', properties);

// Retrieve data
const properties = await kv.get('properties');
```

**Setup:**
1. Vercel Dashboard → Storage → Create KV Database
2. Install: `npm install @vercel/kv`
3. Update API functions to use KV

#### Option 2: Use External Database
- **MongoDB Atlas** (free tier)
- **Supabase** (PostgreSQL + storage)
- **PlanetScale** (MySQL)

#### Option 3: Use Vercel Blob (File Storage)
```javascript
import { put } from '@vercel/blob';

// Upload image
const blob = await put('image.jpg', imageBuffer, {
  access: 'public',
});

console.log(blob.url); // https://...vercel-storage.com/image.jpg
```

**Setup:**
1. Vercel Dashboard → Storage → Blob
2. Install: `npm install @vercel/blob`

---

## 🆚 Vercel vs Other Platforms

| Feature | Vercel | Render | Railway |
|---------|--------|--------|---------|
| **Free Tier** | ✅ Generous | ✅ 750h/mo | ✅ $5 credit |
| **Cold Start** | ❄️ Yes (instant) | ❄️ Yes (30-60s) | ✅ No |
| **Persistent Storage** | ❌ No | ✅ Yes | ✅ Yes |
| **Deployment** | 🚀 Instant | 🐢 2-3 min | 🐢 2-3 min |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free |
| **Git Integration** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Best For** | Serverless APIs | Full apps | Full apps |

---

## 💡 Recommended Architecture

For best results with Vercel:

```
┌─────────────────────────────────────┐
│ Frontend (GitHub Pages)             │
│ https://vishal1412.github.io       │
└─────────────────────────────────────┘
                ↓ ↑
┌─────────────────────────────────────┐
│ Backend API (Vercel)                │
│ https://propscan.vercel.app         │
│ • Serverless functions              │
│ • Fast cold starts                  │
└─────────────────────────────────────┘
                ↓ ↑
┌─────────────────────────────────────┐
│ Database (Choose one)               │
│ • MongoDB Atlas (free)              │
│ • Supabase (free)                   │
│ • Vercel KV (Redis)                 │
└─────────────────────────────────────┘
                ↓ ↑
┌─────────────────────────────────────┐
│ File Storage (Choose one)           │
│ • Vercel Blob                       │
│ • Cloudinary (images)               │
│ • AWS S3                            │
└─────────────────────────────────────┘
```

---

## 🎯 Quick Commands Reference

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Development deployment
vercel

# Production deployment
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm <deployment-url>

# Link to existing project
vercel link

# Pull environment variables
vercel env pull
```

---

## 📊 Monitoring & Analytics

### View Logs
```powershell
vercel logs --follow
```

Or in dashboard: https://vercel.com/dashboard → Project → Logs

### Analytics
- Real-time visitor stats
- Function execution times
- Error tracking
- Bandwidth usage

---

## 💰 Pricing

### Free Tier (Hobby)
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless functions
- ⏱️ 10s function timeout
- 📦 100 GB build time/month

### Pro ($20/month)
- ✅ Everything in Free
- ⏱️ 60s function timeout
- ✅ 1 TB bandwidth
- ✅ Priority support
- ✅ Team collaboration

---

## 🎉 Summary

1. ✅ API folder with serverless functions created
2. ✅ `vercel.json` configuration added
3. ✅ Deploy with `vercel --prod`
4. ✅ Get Vercel URL
5. ✅ Update `src/.env` with URL
6. ✅ Rebuild frontend
7. ✅ Push to GitHub Pages
8. ✅ Import feature works!

**Your backend is now live on Vercel! 🚀**

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Discord**: https://vercel.com/discord
- **Check logs**: `vercel logs`
- **Redeploy**: `vercel --prod --force`

---

## 📌 Next Steps

1. **Consider adding database** for persistent storage
2. **Set up custom domain** (optional)
3. **Enable analytics** in Vercel dashboard
4. **Add error monitoring** (Sentry integration)
5. **Optimize function performance**

Your PropScan backend is now deployed on Vercel! 🎊
