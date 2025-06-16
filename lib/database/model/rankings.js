import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(uri = process.env.MONGODB_URI || "mongodb://localhost:27017/godb") {
  // Check if already connected
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  if (!uri) {
    console.error('❌ MongoDB URI is required but not provided');
    console.log('💡 Please set MONGODB_URI in your environment variables');
    console.log('💡 Create a .env.local file with: MONGODB_URI=your_connection_string');
    throw new Error('MongoDB URI is required but not provided');
  }
  
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Connection refused - please check if MongoDB is running');
      console.log('💡 For local MongoDB: Start MongoDB service');
      console.log('💡 For MongoDB Atlas: Check your connection string and network access');
    }
    
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

// Define schemas
const RankingItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  votes: {
    type: Number,
    default: 0
  },
});

const RankingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  items: {
    type: [RankingItemSchema],
    default: []
  }
});

// Create model (only if it doesn't exist)
const Ranking = mongoose.models.Ranking || mongoose.model('Ranking', RankingSchema, 'rankings');

// Export the model and connection function
export { Ranking };
