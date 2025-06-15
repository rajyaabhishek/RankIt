# Cashfree Payment Gateway Setup Guide

## 🚨 AUTHENTICATION ERROR FIX

The 401 authentication error you're experiencing is because the default test credentials in the code are not valid. You need to get your own Cashfree credentials.

## 📝 Step-by-Step Setup

### 1. Get Your Cashfree Credentials

1. **Visit Cashfree Dashboard**: Go to https://merchant.cashfree.com/
2. **Sign Up/Login**: Create an account or login to existing one
3. **Navigate to API Keys**: Go to "Developers" > "API Keys"
4. **Generate Keys**: In sandbox mode, keys are auto-generated
5. **Copy Credentials**: Copy your App ID and Secret Key

### 2. Create Environment Variables

Create a `.env` file in your project root with your credentials:

```bash
# Cashfree Sandbox Credentials
CASHFREE_SANDBOX_APP_ID=your_actual_app_id_here
CASHFREE_SANDBOX_SECRET=your_actual_secret_key_here

# Environment
NODE_ENV=sandbox
```

### 3. Alternative: Direct Code Update

If you don't want to use environment variables, you can directly update the credentials in `server-fix-example.js`:

```javascript
const CASHFREE_CONFIG = {
  sandbox: {
    APP_ID: 'YOUR_ACTUAL_APP_ID',
    SECRET_KEY: 'YOUR_ACTUAL_SECRET_KEY',
    BASE_URL: 'https://sandbox.cashfree.com/pg',
    API_VERSION: '2023-08-01'
  }
};
```

## 🔧 Testing Your Setup

1. **Restart your server** after updating credentials
2. **Check server logs** for the warning about default credentials
3. **Test a payment** - you should no longer get 401 errors

## 📱 Test Payment Details (Sandbox)

Once your credentials are working, use these test details:

### Test Cards
- **Card Number**: 4444333322221111
- **Expiry**: 03/2028
- **CVV**: 123
- **OTP**: 111000

### Test UPI
- **Success VPA**: testsuccess@gocash
- **Failure VPA**: testfailure@gocash

## 🚀 Going Live

When ready for production:
1. Generate production API keys from Cashfree dashboard
2. Set `NODE_ENV=production`
3. Update production credentials
4. Test thoroughly before launching

## ⚠️ Important Notes

- **Never commit** your actual credentials to version control
- **Keep credentials secure** - don't share them
- **Use environment variables** for production deployments
- **Test thoroughly** in sandbox before going live

## 🆘 Still Having Issues?

If you're still getting authentication errors:
1. Double-check your credentials are copied correctly
2. Ensure no extra spaces in your credentials
3. Verify your Cashfree account is active
4. Contact Cashfree support if credentials still don't work 