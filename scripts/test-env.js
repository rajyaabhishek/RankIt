const { connectToDatabase } = require('../lib/database/model/rankings');
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing environment variable access...');
    const uri = process.env.MONGODB_URI;
    
    if (!uri) throw new Error('MONGODB_URI not found');
    
    console.log('✅ Environment variable loaded');
    await connectToDatabase();
    
    const connectionState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', connectionState);
    
    if (connectionState === 1) {
      console.log('✅ Successfully connected to MongoDB');
    } else {
      throw new Error(`Connection failed with state: ${connectionState}`);
    }
    
    await mongoose.disconnect();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testConnection();