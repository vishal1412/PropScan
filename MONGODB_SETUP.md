# MongoDB Atlas Setup for PropScan Backend

## Why MongoDB Atlas?
Vercel serverless functions have a **read-only filesystem**. MongoDB Atlas provides a free cloud database that's perfect for storing your property data persistently.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google account (FREE)
3. Complete verification

## Step 2: Create a Free Cluster

1. After login, click **"Build a Database"** or **"Create"**
2. Choose **"M0 FREE"** tier
   - ✅ 512 MB storage (plenty for your needs)
   - ✅ Shared RAM
   - ✅ No credit card required
3. **Cloud Provider**: Choose AWS, Google Cloud, or Azure
4. **Region**: Choose closest to your users (e.g., `Mumbai (ap-south-1)` for India or `N. Virginia (us-east-1)` for USA)
5. **Cluster Name**: `propscan-cluster` (or keep default)
6. Click **"Create Cluster"** (takes 3-5 minutes)

## Step 3: Create Database User

1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `propscan-admin`
5. **Password**: Click **"Autogenerate Secure Password"** → **COPY AND SAVE IT!**
   - Example: `xK9mP2nQ7vL4wR8`
6. **Database User Privileges**: Select **"Read and write to any database"**
7. Click **"Add User"**

## Step 4: Whitelist IP Addresses (Allow Access)

1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Choose **"ALLOW ACCESS FROM ANYWHERE"** (for Vercel serverless)
   - This adds `0.0.0.0/0` (required for Vercel's dynamic IPs)
4. Click **"Confirm"**

⚠️ **Security Note**: This is safe because authentication still requires username/password

## Step 5: Get Connection String

1. Go back to **"Database"** → Click **"Connect"** on your cluster
2. Select **"Connect your application"**
3. **Driver**: Node.js
4. **Version**: 5.5 or later
5. **Copy the connection string**:
   ```
   mongodb+srv://propscan-admin:<password>@propscan-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** with the password you saved earlier
7. **Final connection string example**:
   ```
   mongodb+srv://propscan-admin:xK9mP2nQ7vL4wR8@propscan-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Add Environment Variable to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **propscan1-backend** project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `MONGODB_URI` | Your full connection string | Production, Preview, Development |

   Example value:
   ```
   mongodb+srv://propscan-admin:xK9mP2nQ7vL4wR8@propscan-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. Click **"Save"**

## Step 7: Initialize Database (Optional - Auto-creates on first write)

The database will automatically create collections on first use. If you want to pre-populate data:

1. Go to **"Database"** → **"Browse Collections"**
2. Click **"Add My Own Data"**
3. **Database name**: `propscan`
4. **Collection name**: `properties`
5. Click **"Create"**

Repeat for these collections:
- `testimonials`
- `leads`
- `resale-properties`

## Step 8: Install MongoDB Driver & Deploy

```powershell
cd "C:\Users\Nisha Ashok\Documents\PropScan\PropScan"
npm install
git add .
git commit -m "Add MongoDB Atlas integration for persistent storage"
git push origin gh-pages
vercel --prod
```

## Step 9: Test

1. Go to: https://vishal1412.github.io/PropScan/admin
2. Try importing a project
3. Save it
4. Check MongoDB Atlas → **"Database"** → **"Browse Collections"** → **"properties"**
5. You should see your saved data!

## Troubleshooting

### Error: "MongoServerError: bad auth"
- ❌ Wrong username or password
- ✅ Check `MONGODB_URI` in Vercel has correct credentials
- ✅ Verify password doesn't have special characters (if it does, URL-encode them)

### Error: "MongoTimeoutError"
- ❌ Network access not configured
- ✅ Go to "Network Access" → Add `0.0.0.0/0`

### Error: "MongoNetworkError"
- ❌ Connection string incorrect
- ✅ Verify MONGODB_URI format
- ✅ Check cluster name matches

### Data not saving
- Check Vercel logs: `vercel logs propscan1-backend.vercel.app`
- Verify MONGODB_URI environment variable is set
- Check database user has write permissions

## MongoDB Atlas Dashboard

**View Your Data**:
1. Go to **"Database"** → **"Browse Collections"**
2. Select `propscan` database
3. Click on any collection to see documents

**Monitor Usage**:
1. Go to **"Metrics"** tab
2. View connections, operations, storage

## Cost & Limits (Free Tier)

✅ **Storage**: 512 MB (plenty for thousands of properties)
✅ **Connections**: Up to 500 concurrent
✅ **Transfer**: No limit on data transfer
✅ **Duration**: Forever free (no time limit)

**Upgrade** only needed if:
- Storage exceeds 512 MB
- Need more than 500 concurrent connections
- Want backups/advanced features

For your use case: **100% FREE forever!**

## Security Best Practices

1. ✅ Never commit MONGODB_URI to Git
2. ✅ Use strong passwords (auto-generated)
3. ✅ Rotate credentials periodically
4. ✅ Enable MFA on MongoDB Atlas account
5. ✅ Monitor access in Atlas dashboard

## Data Structure

MongoDB will store data like this:

**properties collection**:
```json
{
  "gurgaon": [...],
  "noida": [...],
  "dubai": [...]
}
```

**testimonials collection**:
```json
[
  { "id": "test_123", "name": "John", "message": "Great service!" },
  ...
]
```

## Next Steps

After setup, all your data will be:
- ✅ Saved permanently
- ✅ Accessible from anywhere
- ✅ Backed up automatically (with paid plans)
- ✅ Scalable (can handle millions of records)

No more "read-only filesystem" errors! 🎉
