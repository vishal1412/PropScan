# 🏠 PropScan - Real Estate Property Scanner

Modern real estate platform with property listings, resale marketplace, and admin management.

## 🌐 Live Demo

- **Frontend**: https://vishal1412.github.io/PropScan
- **Backend**: Deploy to Vercel (instructions below)

---

## 🚀 Quick Deploy Backend to Vercel

### Fastest Method: One-Command Deploy

```powershell
.\deploy-vercel.ps1
```

### Manual Deploy

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

Copy your Vercel URL: `https://propscan-backend-xxxx.vercel.app`

---

## ⚙️ Connect Frontend to Backend

1. **Create `src/.env`**:
```bash
VITE_API_URL=https://your-vercel-url.vercel.app/api
```

2. **Rebuild & Deploy**:
```powershell
cd src && npm run build && cd ..
Copy-Item -Path "src/dist/*" -Destination "." -Recurse -Force
git add . && git commit -m "Connect to Vercel" && git push
```

---

## 📚 Complete Documentation

| Guide | Description |
|-------|-------------|
| **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** | ⭐ Vercel deployment (RECOMMENDED) |
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | Render.com deployment |
| **[BACKEND_DEPLOYMENT_GUIDE.md](BACKEND_DEPLOYMENT_GUIDE.md)** | All platforms |
| **[README_DEPLOYMENT.md](README_DEPLOYMENT.md)** | Architecture overview |

---

## 🎯 Features

- ✅ Property listings & search
- ✅ Resale marketplace
- ✅ Admin panel with import
- ✅ Lead management
- ✅ Web scraping
- ✅ Responsive design

---

## 🛠️ Tech Stack

**Frontend**: React + TypeScript + Vite + TailwindCSS  
**Backend**: Vercel Serverless Functions  
**Hosting**: GitHub Pages + Vercel

**Full documentation**: See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
