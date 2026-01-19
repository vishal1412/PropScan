# Backend Deployment Guide

## Problem: GitHub Pages Limitations

**GitHub Pages is a static site hosting service** and CANNOT:
- ❌ Run Node.js/Express servers
- ❌ Execute server-side code
- ❌ Host API endpoints
- ❌ Write to file system
- ❌ Download/process images

Your PropScan application has two parts:
1. **Frontend (React)** - Can be hosted on GitHub Pages ✅
2. **Backend (Express API)** - Needs separate hosting ❌

## Features Affected

Without a backend server, these features won't work:
- 🔴 Project content extraction (Import feature)
- 🔴 Image downloading from external websites
- 🔴 Adding/editing projects via admin panel
- 🔴 Managing testimonials
- 🔴 Managing leads
- 🔴 Resale properties CRUD operations

## Solution: Deploy Backend Separately

You need to deploy your Express server (`src/api-server.js`) to a platform that supports Node.js.

---

## Option 1: Render.com (Recommended - Free Tier)

### Steps:

1. **Create `package.json` for backend** (in project root):
```json
{
  "name": "propscan-backend",
  "version": "1.0.0",
  "description": "PropScan API Server",
  "main": "src/api-server.js",
  "scripts": {
    "start": "node src/api-server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12"
  }
}
```

2. **Sign up at [Render.com](https://render.com)**

3. **Create a new Web Service**:
   - Connect your GitHub repository
   - Branch: `gh-pages`
   - Root Directory: `./`
   - Build Command: `cd src && npm install`
   - Start Command: `node src/api-server.js`
   - Environment: `Node`

4. **Configure Environment Variables**:
   - Add `PORT` = `3001` (Render will override with their port)

5. **Deploy** - Render will provide a URL like:
   ```
   https://propscan-backend.onrender.com
   ```

6. **Update Frontend**: Set your backend URL in `.env` file:
   ```bash
   VITE_API_URL=https://propscan-backend.onrender.com/api
   ```

7. **Rebuild and redeploy frontend** to GitHub Pages

---

## Option 2: Railway.app (Free Tier)

### Steps:

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project** → Deploy from GitHub

3. **Select your PropScan repository**

4. **Configure**:
   - Root Directory: `src`
   - Start Command: `node api-server.js`
   - Port: `3001`

5. **Deploy** - Railway provides URL like:
   ```
   https://propscan-backend-production.up.railway.app
   ```

6. **Update `.env`**:
   ```bash
   VITE_API_URL=https://propscan-backend-production.up.railway.app/api
   ```

---

## Option 3: Vercel (Serverless Functions)

Requires converting Express routes to serverless functions.

### Steps:

1. **Create `api/` folder** in project root

2. **Convert each route to a function** (`api/extract.js`):
```javascript
// api/extract.js
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { websiteUrl } = req.body;
    // ... extraction logic ...
    res.json({ data: extractedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

3. **Deploy to Vercel**:
```bash
npm i -g vercel
vercel login
vercel --prod
```

4. **Update `.env`**:
```bash
VITE_API_URL=https://your-project.vercel.app/api
```

**Note**: File uploads and persistent storage are limited on Vercel.

---

## Option 4: Heroku (Paid - No Free Tier)

### Steps:

1. **Install Heroku CLI**:
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku app**:
```bash
heroku create propscan-backend
```

3. **Add `Procfile`** (in project root):
```
web: node src/api-server.js
```

4. **Deploy**:
```bash
git push heroku gh-pages:main
```

5. **Set environment variables**:
```bash
heroku config:set NODE_ENV=production
```

6. **Update `.env`**:
```bash
VITE_API_URL=https://propscan-backend.herokuapp.com/api
```

---

## Option 5: Run Backend Locally (Development Only)

For testing/development, you can run the backend locally:

### Steps:

1. **Start backend** (Terminal 1):
```bash
cd src
npm install
node api-server.js
```
Backend runs at `http://localhost:3001`

2. **Update CORS in `api-server.js`**:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'https://vishal1412.github.io'],
  credentials: true
}));
```

3. **Frontend will connect to local backend**:
- On localhost: Uses `http://localhost:3001/api`
- On GitHub Pages: Set `VITE_API_URL=http://localhost:3001/api` (requires backend running)

**Limitation**: Only works when you have backend running locally.

---

## Configuration Steps (After Deploying Backend)

### 1. Create `.env` file in `src/` directory:

```bash
# Backend API URL (your deployed backend)
VITE_API_URL=https://your-backend-url.com/api

# Example for Render:
# VITE_API_URL=https://propscan-backend.onrender.com/api

# Example for Railway:
# VITE_API_URL=https://propscan-backend-production.up.railway.app/api
```

### 2. Update `.env.production`:

```bash
VITE_API_URL=https://your-backend-url.com/api
```

### 3. Rebuild frontend:

```bash
cd src
npm run build
```

### 4. Copy to root and deploy:

```bash
cd ..
Copy-Item -Path "src/dist/*" -Destination "." -Recurse -Force
git add .
git commit -m "Update with backend URL"
git push origin gh-pages
```

---

## Testing Backend Deployment

### Test with curl:

```bash
# Test health endpoint
curl https://your-backend-url.com/api/health

# Test properties endpoint
curl https://your-backend-url.com/api/properties

# Test extraction endpoint
curl -X POST https://your-backend-url.com/api/projects/extract \
  -H "Content-Type: application/json" \
  -d '{"websiteUrl":"https://example.com"}'
```

### Test from browser console:

```javascript
// Open your GitHub Pages site, then run in console:
fetch('https://your-backend-url.com/api/properties')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## Recommended Solution

**For Production**: Deploy to **Render.com** (free tier)
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Persistent storage
- ✅ Always online
- ✅ SSL included
- ✅ File system access

**For Development**: Run backend locally
- ✅ No cost
- ✅ Full control
- ✅ Fast testing
- ❌ Not accessible from deployed frontend

---

## Important Notes

### CORS Configuration

Your backend must allow requests from GitHub Pages:

```javascript
// In api-server.js
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://vishal1412.github.io'
  ],
  credentials: true
}));
```

### File Storage

When deployed:
- **Render/Railway**: Files stored in `/src/public/data/` persist during runtime only
- **Vercel**: No persistent file storage - use database (MongoDB, PostgreSQL)
- **Better solution**: Use cloud storage (AWS S3, Cloudinary) for images

### Database Alternative

For production, consider replacing JSON files with a database:
- **MongoDB Atlas** (free tier) for JSON-like storage
- **PostgreSQL** on Render/Railway
- **Supabase** (free tier with PostgreSQL + storage)

---

## Troubleshooting

### Error: 405 Method Not Allowed
- Backend not deployed or URL incorrect
- Check `.env` file has correct `VITE_API_URL`
- Rebuild frontend after changing `.env`

### Error: CORS Policy
- Add your GitHub Pages domain to CORS config in backend
- Ensure backend is deployed and running

### Error: Network Request Failed
- Backend server is down
- Check backend logs on hosting platform
- Test backend URL directly in browser

### Images Not Loading
- Images must be accessible via URL
- If using local storage, images won't persist on serverless platforms
- Use Cloudinary or S3 for image hosting

---

## Quick Start (Render.com)

1. **Go to [Render.com](https://render.com)** and sign up
2. **New** → **Web Service**
3. **Connect GitHub** repo: `vishal1412/PropScan`
4. **Configure**:
   - Name: `propscan-backend`
   - Branch: `gh-pages`
   - Root Directory: `.`
   - Build: `cd src && npm install`
   - Start: `node src/api-server.js`
5. **Deploy** - Copy the URL (e.g., `https://propscan-backend.onrender.com`)
6. **Create `src/.env`**:
   ```
   VITE_API_URL=https://propscan-backend.onrender.com/api
   ```
7. **Rebuild & Deploy**:
   ```bash
   cd src
   npm run build
   cd ..
   Copy-Item -Path "src/dist/*" -Destination "." -Recurse -Force
   git add .
   git commit -m "Connect to Render backend"
   git push origin gh-pages
   ```

Done! Your admin panel import feature will now work. 🎉

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs

Choose Render.com for easiest setup with free tier!
