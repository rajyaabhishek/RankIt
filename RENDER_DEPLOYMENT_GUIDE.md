# Deploy Payment Server to Render

## Step 1: Prepare for Render Deployment

Your payment server (`server.js`) needs to be deployed separately from your main Next.js app.

## Step 2: Create Render Account and Deploy

1. **Go to Render.com**: https://render.com
2. **Sign up/Login** with your GitHub account
3. **Create New Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `https://github.com/rajyaabhishek/RankIt.git`
   - Select the repository

## Step 3: Configure Render Settings

**Basic Settings:**
- **Name**: `rankit-payment-server`
- **Root Directory**: Leave empty (uses root)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

## Step 4: Set Environment Variables

In Render dashboard, add these environment variables:

```bash
# Port (Render will set this automatically, but you can specify)
PORT=8000

# Node Environment
NODE_ENV=production

# Cashfree Credentials (CRITICAL - Replace with your real credentials)
REACT_APP_CASHFREE_APP_ID=your_actual_cashfree_app_id
REACT_APP_CASHFREE_SECRET_KEY=your_actual_cashfree_secret_key
REACT_APP_CASHFREE_ENVIRONMENT=sandbox

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# API URL (will be your Render URL)
REACT_APP_API_URL=https://rankit-z5g4.onrender.com
```

## Step 5: Update server.js for Production

Your `server.js` file needs these production-ready configurations:

```javascript
// Update CORS origins to include your Vercel domain
const allowedOrigins = [
    'https://rankit.space',
    'https://my-f0kpplqiq-abhisheks-projects-10c7cd34.vercel.app',
    'https://rajyaabhishek.github.io',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
];
```

## Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy from your GitHub repo
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your server will be available at: `https://rankit-z5g4.onrender.com`

## Step 7: Test Your Deployment

Test these endpoints:

1. **Health Check**: `https://rankit-z5g4.onrender.com/debug-auth`
2. **Pricing**: `https://rankit-z5g4.onrender.com/pricing`

## Step 8: Update Frontend Environment Variables

In your Vercel dashboard, add this environment variable:
- **Key**: `REACT_APP_API_URL`
- **Value**: `https://rankit-z5g4.onrender.com`

## Common Issues & Solutions

### Issue: "App failed to start"
- **Solution**: Check that `package.json` has all dependencies
- **Fix**: Make sure `server-package.json` dependencies are merged into main `package.json`

### Issue: "Port already in use"
- **Solution**: Render automatically assigns PORT environment variable
- **Fix**: Use `const port = process.env.PORT || 8000;` in server.js

### Issue: CORS errors
- **Solution**: Update `allowedOrigins` array in server.js
- **Add**: Your Vercel domain to the allowed origins

### Issue: Cashfree "payment_session_id_invalid"
- **Solution**: Replace demo credentials with real ones
- **Get**: Real credentials from https://merchant.cashfree.com/

## Free Tier Limitations

Render free tier includes:
- ✅ 750 hours/month (enough for most projects)
- ✅ Automatic SSL certificates
- ✅ Custom domains
- ❌ Server sleeps after 15 minutes of inactivity
- ❌ Cold start delay (10-30 seconds)

## Upgrade Options

For production use, consider:
- **Starter Plan**: $7/month - No sleeping, faster builds
- **Standard Plan**: $25/month - More resources, better performance

## Final Checklist

- [ ] Server deployed to Render
- [ ] Environment variables set
- [ ] CORS origins updated
- [ ] Frontend pointing to Render URL
- [ ] Test payment flow works
- [ ] Real Cashfree credentials configured

Your payment server should now be live at: **https://rankit-z5g4.onrender.com** 