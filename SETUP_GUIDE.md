# Premium Payment Setup Guide

This guide will help you set up the payment system with $5/month and $45/year pricing plans.

## Overview

The payment system includes:
- **Monthly Plan**: $5/month
- **Yearly Plan**: $45/year (Save $15!)
- Cashfree Payment Gateway integration
- Secure payment processing
- Subscription management

## File Structure

```
├── server.js                    # Backend Express server
├── server-package.json          # Backend dependencies
├── components/
│   └── PaymentButton.tsx        # Payment button component
├── app/
│   └── premium/
│       └── page.tsx             # Premium pricing page
```

## Environment Setup

Create a `.env` file in your root directory with the following variables:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-database?retryWrites=true&w=majority&appName=Cluster

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# Cashfree Payment Gateway Configuration
REACT_APP_CASHFREE_ENVIRONMENT=sandbox
REACT_APP_CASHFREE_APP_ID=TEST_your_app_id
REACT_APP_CASHFREE_SECRET_KEY=cfsk_ma_test_your_secret_key

# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Node Environment
NODE_ENV=development
```

## Installation & Setup

### 1. Install Frontend Dependencies

```bash
npm install @cashfreepayments/cashfree-js
```

### 2. Install Backend Dependencies

Create a separate directory for your backend and install:

```bash
# In your backend directory
npm init -y
npm install express cors crypto cashfree-pg dotenv axios
```

### 3. Start the Services

#### Backend Server
```bash
node server.js
```

#### Frontend (Next.js)
```bash
npm run dev
```

## Pricing Plans

### Monthly Plan
- **Price**: $5/month
- **Features**: 
  - Unlimited document processing
  - Priority support
  - Advanced templates
  - Export in multiple formats
  - Cloud storage integration
  - No ads

### Yearly Plan
- **Price**: $45/year
- **Savings**: $15 compared to monthly billing
- **Additional Features**:
  - All monthly plan features
  - Exclusive yearly features
  - Early access to new features

## API Endpoints

### GET/POST `/payment`
Creates a payment order for the selected plan.

**Parameters:**
- `planType`: 'monthly' or 'yearly'
- `userEmail`: User's email address
- `userName`: User's full name
- `userPhone`: User's phone number
- `userId`: User's unique ID

### GET `/pricing`
Returns available pricing plans and their details.

### POST `/verify`
Verifies payment status after completion.

**Parameters:**
- `orderId`: Order ID to verify

### POST `/webhook`
Handles payment notifications from Cashfree.

## Usage

### 1. Navigate to Premium Page
Users can visit `/premium` to see the pricing plans.

### 2. Select a Plan
Users can choose between monthly ($5) or yearly ($45) plans.

### 3. Payment Process
- User clicks on a payment button
- PaymentButton component handles the payment flow
- Cashfree SDK processes the payment
- Payment verification occurs automatically
- User subscription is updated upon successful payment

### 4. Integration in Your App

```tsx
import PaymentButton from '@/components/PaymentButton';

// Monthly plan button
<PaymentButton 
  planType="monthly" 
  onSuccess={handlePaymentSuccess}
/>

// Yearly plan button
<PaymentButton 
  planType="yearly" 
  onSuccess={handlePaymentSuccess}
/>
```

## Testing

### Test Card Details (Sandbox)
- **Card Number**: 4444333322221111
- **Expiry**: 03/2028
- **CVV**: 123
- **OTP**: 111000

### Test Endpoints
- `/test` - Check server status
- `/debug-auth` - Check Cashfree credentials

## Security Considerations

1. **Environment Variables**: Keep all sensitive keys in environment variables
2. **CORS Configuration**: Properly configure allowed origins
3. **Payment Verification**: Always verify payments on the backend
4. **HTTPS**: Use HTTPS in production
5. **Webhook Security**: Implement webhook signature verification

## Production Deployment

1. Update `REACT_APP_CASHFREE_ENVIRONMENT` to `production`
2. Use production Cashfree credentials
3. Update allowed origins in CORS configuration
4. Set up proper webhook URLs
5. Configure production database

## Support

For payment-related issues:
1. Check server logs for errors
2. Verify environment variables
3. Test with sandbox credentials first
4. Contact Cashfree support for payment gateway issues

## Features

- ✅ Monthly and yearly subscription plans
- ✅ Secure payment processing with Cashfree
- ✅ Payment verification and webhook handling
- ✅ User authentication with Clerk
- ✅ Responsive pricing page design
- ✅ Error handling and user feedback
- ✅ CORS configuration for security
- ✅ Environment-based configuration 