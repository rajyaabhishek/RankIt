import { NextResponse } from 'next/server';
import { Ranking, connectToDatabase } from '@/lib/database/model/rankings';

// Define an interface for the MongoDB document structure
interface RankingDocument {
  _id: { toString(): string };
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    image?: string;
  };
  createdAt: Date | string;
  items: any[];
}

// Interface for incoming POST request
interface CreateRankingRequest {
  title: string;
  description: string;
  category: string;
  items: Array<{
    name: string;
    description?: string;
  }>;
  author?: {
    name: string;
    image?: string;
  };
}

export async function GET() {
  try {
    console.log("API: Connecting to database...");
    await connectToDatabase();
    console.log("API: Database connection successful");
    
    console.log("API: Fetching rankings...");
    const rankings = await Ranking.find().lean();
    console.log("API: Raw rankings data:", JSON.stringify(rankings).substring(0, 200) + "...");
    
    // Transform MongoDB documents to match client-side types
    const formattedRankings = rankings.map((ranking: any) => ({
      ...ranking,
      _id: ranking._id.toString(),
      createdAt: ranking.createdAt instanceof Date 
        ? ranking.createdAt.toISOString() 
        : ranking.createdAt,
      // We don't need to include all item details in the list view
      // Just keep minimal data needed for the card display
    }));
    
    console.log(`API: Successfully transformed ${formattedRankings.length} rankings`);
    return NextResponse.json({
      success: true, 
      rankings: formattedRankings
    });
  } catch(error:any) {
    // More detailed error logging
    console.error("API Error fetching all rankings:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json({
      success: false, 
      error: `Failed to fetch rankings: ${error.message}`
    }, { 
      status: 500 
    });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { title, description, category, items, author } = body;
    
    // Validate required fields
    if (!title || !description || !category || !items || !Array.isArray(items) || items.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields or items array is too short'
      }, { status: 400 });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Generate a unique ID for the ranking
    // This is a simple implementation - in production, you might want a more robust solution
    const count = await Ranking.countDocuments();
    const newId = String(count + 1);
    
    // Process items to add initial vote counts
    const processedItems = items.map((item, index) => ({
      id: index + 1,
      name: item.name,
      description: item.description,
      votes: 0
    }));
    
    // Create new ranking document
    const newRanking = {
      id: newId,
      title,
      description,
      category,
      author: author || {
        name: "Anonymous", // Default fallback
        image: "https://randomuser.me/api/portraits/lego/1.jpg" // Default fallback image
      },
      createdAt: new Date(),
      items: processedItems
    };
    
    // Save to database
    const result = await Ranking.create(newRanking);
    
    return NextResponse.json({
      success: true,
      message: 'Ranking created successfully',
      ranking: {
        ...newRanking,
        _id: result._id.toString()
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("API Error creating ranking:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json({
      success: false,
      error: `Failed to create ranking: ${error.message}`
    }, { status: 500 });
  }
} 