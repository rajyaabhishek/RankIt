const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { Cashfree, CFEnvironment } = require('cashfree-pg');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// More robust CORS configuration
const isProduction = process.env.NODE_ENV === 'production' || process.env.PORT || process.env.RENDER;

// Comprehensive list of allowed origins
const allowedOrigins = [
    'https://rankit.space',
    'https://rank-it-main-o82o1zvbx-abhisheks-projects-10c7cd34.vercel.app',
    'https://rank-it-main-rb4sel0wf-abhisheks-projects-10c7cd34.vercel.app',
    'https://rank-it-main-iyp6o6qcs-abhisheks-projects-10c7cd34.vercel.app',
    'https://rank-it-main-ezts2foiz-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-f0kpplqiq-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-pi4dc4ezw-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-cqq7dc5zy-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-nmha4dyea-abhisheks-projects-10c7cd34.vercel.app',
    'https://rajyaabhishek.github.io',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://my-g4c9fypp4-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-qssck7u7v-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-i0aceyoih-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-ad2men14t-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-kckbwgm7c-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-6ulz3d4d4-abhisheks-projects-10c7cd34.vercel.app',
    'https://my-df24qc54e-abhisheks-projects-10c7cd34.vercel.app',
    'https://www.rankit.space'
];

// CORS configuration with proper error handling
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`CORS blocked request from origin: ${origin}`);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
    preflightContinue: false
}));

// Handle preflight requests explicitly for all routes
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    
    if (!origin || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Max-Age', '86400'); // 24 hours
        res.status(200).end();
    } else {
        res.status(403).json({ error: 'CORS not allowed' });
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Additional middleware to ensure CORS headers on all responses
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    }
    next();
});

// Configure Cashfree
console.log('Configuring Cashfree...');

let cashfreeInstance = null;

try {
    if (process.env.NEXT_PUBLIC_CASHFREE_APP_ID && process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY) {
        const environment = (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'production') 
            ? CFEnvironment.PRODUCTION 
            : CFEnvironment.SANDBOX;
        
        // Create Cashfree instance for v5+ (correct approach)
        cashfreeInstance = new Cashfree(environment, process.env.NEXT_PUBLIC_CASHFREE_APP_ID, process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY);
        
        console.log('✅ Cashfree configured successfully');
        console.log('Environment:', process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'production' ? 'PRODUCTION' : 'SANDBOX');
        console.log('App ID:', process.env.NEXT_PUBLIC_CASHFREE_APP_ID.substring(0, 10) + '...');
    } else {
        console.error('❌ Cashfree credentials not found in environment variables');
        console.log('Please ensure you have set:');
        console.log('- NEXT_PUBLIC_CASHFREE_APP_ID');
        console.log('- NEXT_PUBLIC_CASHFREE_SECRET_KEY');
        console.log('- NEXT_PUBLIC_CASHFREE_ENVIRONMENT');
    }
} catch (error) {
    console.error('❌ Error configuring Cashfree:', error.message);
}

function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    const orderId = hash.digest('hex');
    return orderId.substr(0, 12);
}

// Pricing configuration
const PRICING_PLANS = {
    monthly: {
        price: 415.00, // ~$5 USD converted to INR
        currency: 'INR',
        displayPrice: '$5',
        description: 'Premium Monthly Plan',
        billingCycle: 'monthly'
    },
    yearly: {
        price: 3735.00, // ~$45 USD converted to INR  
        currency: 'INR',
        displayPrice: '$45',
        description: 'Premium Yearly Plan',
        billingCycle: 'yearly'
    }
};

// Get pricing information
app.get('/pricing', (req, res) => {
    res.json({
        plans: PRICING_PLANS,
        success: true
    });
});

// Health check endpoint for Render
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'RankIt Payment Server is running',
        timestamp: new Date().toISOString(),
        environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT'
    });
});

app.listen(port, () => {
    // Server running silently
    console.log(`Server is running on port ${port}`);
    console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
    console.log('Allowed origins:', allowedOrigins);
});



// Handle both GET and POST requests for payment
app.all('/payment', async (req, res) => {
    // Ensure CORS headers are set for this endpoint
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    try {
        const planType = req.query.planType || req.body.planType || 'monthly';
        const userEmail = req.query.userEmail || req.body.userEmail || 'customer@example.com';
        const userName = req.query.userName || req.body.userName || 'Customer Name';
        const userPhone = req.query.userPhone || req.body.userPhone || '9999999999';
        const userId = req.query.userId || req.body.userId || `cust_${Math.floor(Math.random() * 1000000)}`;
        
        // Get pricing based on plan type
        const selectedPlan = PRICING_PLANS[planType];
        if (!selectedPlan) {
            return res.status(400).json({ 
                error: 'Invalid plan type',
                availablePlans: Object.keys(PRICING_PLANS)
            });
        }
        
        const request = {
            "order_amount": selectedPlan.price.toFixed(2),
            "order_currency": "INR",
            "order_id": await generateOrderId(),
            "customer_details": {
                "customer_id": userId,
                "customer_phone": userPhone,
                "customer_name": userName,
                "customer_email": userEmail
            },
            "order_meta": {
                "plan": selectedPlan.description,
                "billing_cycle": selectedPlan.billingCycle,
                "display_price": selectedPlan.displayPrice,
                "return_url": isProduction 
                    ? "https://rank-it-main-ezts2foiz-abhisheks-projects-10c7cd34.vercel.app/payment/return?order_id={order_id}" 
                    : "http://localhost:3000/payment/return?order_id={order_id}",
                "notify_url": isProduction 
                    ? `${process.env.NEXT_PUBLIC_API_URL || 'https://rankit-z5g4.onrender.com'}/webhook` 
                    : "http://localhost:8000/webhook"
            }
        };



        // Check if Cashfree is properly configured
        if (!cashfreeInstance) {
            return res.status(500).json({ 
                error: 'Payment gateway not configured',
                details: 'Cashfree instance not set'
            });
        }

        cashfreeInstance.PGCreateOrder(request)
            .then(response => {
                res.json({
                    payment_session_id: response.data.payment_session_id,
                    order_id: response.data.order_id,
                    plan: selectedPlan,
                    status: 'OK'
                });
            })
            .catch(error => {
                console.error('Cashfree PGCreateOrder error:', error);
                res.status(500).json({ 
                    error: error.response?.data?.message || 'Failed to create payment order',
                    details: error.response?.data || error.message
                });
            });
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

app.post('/verify', async (req, res) => {
    // Ensure CORS headers are set for this endpoint
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    try {
        let { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        if (!cashfreeInstance) {
            return res.status(500).json({ error: 'Payment gateway not configured' });
        }

        cashfreeInstance.PGOrderFetchPayments(orderId).then((response) => {
            res.json(response.data);
        }).catch(error => {
            res.status(500).json({ 
                error: error.response?.data?.message || 'Payment verification failed',
                orderId: orderId,
                details: error.response?.data
            });
        })

    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
})

// Webhook endpoint for payment notifications
app.post('/webhook', (req, res) => {
    res.status(200).json({ status: 'received' });
});

// Test endpoint to manually trigger subscription update
app.post('/test-subscription', (req, res) => {
    const { plan, billingCycle, userId } = req.body;
    
    res.json({ 
        success: true, 
        message: `Subscription updated to ${plan} (${billingCycle}) for user ${userId}`,
        credits: plan === 'Starter' ? 1000 : 400
    });
});

// Test endpoint to verify CORS and server status
app.get('/test', (req, res) => {
    res.json({
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
        allowedOrigins: allowedOrigins,
        requestOrigin: req.get('Origin') || 'No origin header'
    });
}); 