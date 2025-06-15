import { NextResponse } from 'next/server';
import { Ranking, connectToDatabase } from '@/lib/database/model/rankings';

interface RankingDoc {
  _id: { toString(): string };
  createdAt: Date | string;
  items: Array<{ votes: number }>;
}

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  const category = params.category;
  
  if (!category) {
    return NextResponse.json({ 
      success: false, 
      error: 'Category is required' 
    }, { 
      status: 400 
    });
  }

  try {
    // Connect to database
    await connectToDatabase();
    
    // Find rankings by category - case insensitive search
    const rankings = await Ranking.find({
      category: { $regex: new RegExp(category, 'i') }
    }).lean();
    
    if (!rankings || rankings.length === 0) {
      console.log(`No rankings found for category: ${category}`);
      return NextResponse.json({
        success: true,
        rankings: [] // Return empty array instead of error for easier frontend handling
      });
    }

    // Transform MongoDB documents for client use
    const formattedRankings = rankings.map(ranking => {
      const typedRanking = ranking as unknown as RankingDoc;
      return {
        ...ranking,
        _id: typedRanking._id.toString(),
        createdAt: typedRanking.createdAt instanceof Date 
          ? typedRanking.createdAt.toISOString() 
          : typedRanking.createdAt,
        totalVotes: typedRanking.items.reduce((sum: number, item: { votes: number }) => 
          sum + (item.votes || 0), 0),
        itemCount: typedRanking.items.length
      };
    });

    return NextResponse.json({
      success: true,
      rankings: formattedRankings
    });

  } catch (error: any) {
    console.error(`Error fetching rankings for category ${category}:`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch rankings'
    }, {
      status: 500
    });
  }
} 