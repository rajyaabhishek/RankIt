#!/usr/bin/env node

// Simple setup script to configure Cashfree credentials
const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🚀 Cashfree Payment Gateway Setup');
console.log('==================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupCashfree() {
  try {
    console.log('This script will help you configure your Cashfree credentials.\n');
    
    console.log('📋 First, get your credentials from Cashfree:');
    console.log('   1. Go to https://merchant.cashfree.com/');
    console.log('   2. Navigate to Developers > API Keys');
    console.log('   3. Copy your App ID and Secret Key\n');
    
    const hasCredentials = await askQuestion('Do you have your Cashfree credentials ready? (y/n): ');
    
    if (hasCredentials.toLowerCase() !== 'y') {
      console.log('\n❌ Please get your credentials first and then run this script again.');
      console.log('📖 See CASHFREE_SETUP.md for detailed instructions.');
      rl.close();
      return;
    }
    
    console.log('\n📝 Enter your credentials:');
    const appId = await askQuestion('App ID: ');
    const secretKey = await askQuestion('Secret Key: ');
    
    if (!appId || !secretKey) {
      console.log('\n❌ Both App ID and Secret Key are required.');
      rl.close();
      return;
    }
    
    // Create .env file
    const envContent = `# Cashfree Payment Gateway Configuration
CASHFREE_SANDBOX_APP_ID=${appId}
CASHFREE_SANDBOX_SECRET=${secretKey}
NODE_ENV=sandbox

# Add production credentials when ready to go live
# CASHFREE_PROD_APP_ID=your_production_app_id
# CASHFREE_PROD_SECRET=your_production_secret
`;
    
    const envPath = path.join(process.cwd(), '.env');
    
    // Check if .env exists
    if (fs.existsSync(envPath)) {
      const overwrite = await askQuestion('\n.env file already exists. Overwrite? (y/n): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('\n📝 Manual setup: Add these lines to your .env file:');
        console.log(envContent);
        rl.close();
        return;
      }
    }
    
    // Write .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Configuration saved to .env file!');
    console.log('\n🔄 Next steps:');
    console.log('   1. Restart your payment server: node server-fix-example.js');
    console.log('   2. Test a payment to verify it works');
    console.log('   3. Check for the "Using Default Credentials: NO ✅" message');
    
    console.log('\n📱 Test payment details (sandbox):');
    console.log('   Card: 4444333322221111');
    console.log('   Expiry: 03/2028');
    console.log('   CVV: 123');
    console.log('   OTP: 111000');
    
    rl.close();
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    rl.close();
  }
}

setupCashfree(); 