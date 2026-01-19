# 🎯 Vercel Deployment - Quick Reference Card

## ⚡ Deploy in 3 Commands

```powershell
# 1. Install & Login
npm install -g vercel
vercel login

# 2. Deploy
vercel --prod

# 3. Copy URL and update .env
# Create src/.env with:
VITE_API_URL=https://your-url.vercel.app/api
```

---

## 📋 Full Deployment Checklist

- [ ] 1. Deploy backend to Vercel: `vercel --prod`
- [ ] 2. Copy Vercel URL from output
- [ ] 3. Create `src/.env` file
- [ ] 4. Add `VITE_API_URL=https://your-url.vercel.app/api`
- [ ] 5. Test health: Visit `https://your-url.vercel.app/api/health`
- [ ] 6. Rebuild frontend: `cd src && npm run build`
- [ ] 7. Copy to root: `Copy-Item -Path "src/dist/*" -Destination "." -Recurse -Force`
- [ ] 8. Commit: `git add . && git commit -m "Connect Vercel"`
- [ ] 9. Push: `git push origin gh-pages`
- [ ] 10. Wait 2 min, test: https://vishal1412.github.io/PropScan/admin

---

## 🧪 Test Endpoints

```javascript
// Browser console test
fetch('https://YOUR-URL.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log);

// Expected response:
// { status: "ok", message: "...", timestamp: "..." }
```

---

## 📁 Files Created

```
PropScan/
├── api/                      # ✅ Serverless functions
│   ├── health.js            # Health check
│   ├── properties.js        # Properties CRUD
│   ├── testimonials.js      # Testimonials CRUD
│   ├── leads.js             # Leads CRUD
│   ├── resale-properties.js # Resale marketplace
│   ├── extract.js           # Web scraping
│   └── validate-images.js   # Image validation
├── vercel.json              # ✅ Vercel config
├── package.json             # ✅ Updated with deps
├── deploy-vercel.ps1        # ✅ Auto deployment
└── VERCEL_DEPLOYMENT.md     # ✅ Full guide
```

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/properties` | GET, POST, PUT, DELETE | Properties |
| `/api/testimonials` | GET, POST, PUT, DELETE | Testimonials |
| `/api/leads` | GET, POST, DELETE | Leads |
| `/api/resale-properties` | GET, POST, PUT, DELETE | Resale |
| `/api/projects/extract` | POST | Web scraping |
| `/api/validate-images` | POST | Image check |

---

## 🔧 Useful Commands

```powershell
# View logs
vercel logs

# List deployments
vercel ls

# Redeploy
vercel --prod --force

# Pull environment variables
vercel env pull

# Open dashboard
vercel dashboard
```

---

## 🐛 Common Issues & Fixes

### ❌ 405 Method Not Allowed
```
✅ Fix: Update src/.env and rebuild
```

### ❌ CORS Error
```
✅ Fix: Check API files have CORS headers (already added)
```

### ❌ Function timeout
```
✅ Fix: Upgrade to Vercel Pro ($20/mo) or optimize code
```

### ❌ Import not working
```
✅ Fix:
1. Check .env has correct URL
2. Rebuild: cd src && npm run build
3. Test health endpoint first
```

---

## 💡 Pro Tips

1. **Always test health endpoint first**
   ```
   https://your-url.vercel.app/api/health
   ```

2. **Rebuild after changing .env**
   ```powershell
   cd src && npm run build
   ```

3. **Check Vercel logs for errors**
   ```powershell
   vercel logs
   ```

4. **Use auto-deployment script**
   ```powershell
   .\deploy-vercel.ps1
   ```

---

## 📊 What Works Now

| Feature | Before | After |
|---------|--------|-------|
| Browse Properties | ✅ | ✅ |
| View Details | ✅ | ✅ |
| **Admin Import** | ❌ | ✅ |
| **Add Projects** | ❌ | ✅ |
| **Edit Projects** | ❌ | ✅ |
| **Manage Leads** | ❌ | ✅ |

---

## 🎉 Success Indicators

✅ Health endpoint returns JSON  
✅ Browser console shows: "API Base URL: https://..."  
✅ Admin import works without 405 error  
✅ Can add/edit properties  
✅ Leads are saved  

---

## 📞 Get Help

- **Full Guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Vercel Docs**: https://vercel.com/docs
- **Check Logs**: `vercel logs`
- **Dashboard**: https://vercel.com/dashboard

---

## ⚡ One-Line Deploy

```powershell
vercel login && vercel --prod
```

**That's it! 🚀**
