const { MongoClient } = require('mongodb');

async function checkDatabase() {
  // Connection URI
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  
  // Create a new MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB");

    // Get reference to the database
    const database = client.db("godb");
    const rankings = database.collection("rankings");
    
    // Check if collection exists and has documents
    const count = await rankings.countDocuments();
    console.log(`Found ${count} documents in rankings collection`);
    
    if (count > 0) {
      // Get a sample document
      const sample = await rankings.findOne({});
      console.log("Sample document:", JSON.stringify(sample, null, 2));
    }

  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await client.close();
    console.log("Database connection closed");
  }
}

checkDatabase();