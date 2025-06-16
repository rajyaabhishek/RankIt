import { NextResponse } from 'next/server';
import { 
  getVoteSummary, 
  upsertVote, 
  getVote, 
  calculateVoteChange 
} from '@/lib/database/model/votes.js';
import { Ranking } from '@/lib/database/model/rankings.js';
import { connectToDatabase } from '@/lib/database/model/rankings.js';
import mongoose from 'mongoose';

// Add a type definition for ranking object
interface RankingDocument {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  items: Array<{
    id: number;
    name: string;
    votes: number;
  }>;
}

// Helper function to safely check if a string is a valid ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && (id.length === 12 || id.length === 24);
}

// Helper function to create a robust search query for rankings
function createRankingSearchQuery(rankingId: string) {
  const queries = [];
  
  // Always try custom id field first
  queries.push({ id: rankingId });
  
  // If it's a valid ObjectId, also try _id field
  if (isValidObjectId(rankingId)) {
    queries.push({ _id: new mongoose.Types.ObjectId(rankingId) });
  }
  
  return { $or: queries };
}

// GET handler to retrieve ranking details or vote summary for a specific item
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rankingId } = await params;
    const url = new URL(request.url);
    const itemId = url.searchParams.get('itemId');
    const userId = url.searchParams.get('userId');

    if (!rankingId) {
      return NextResponse.json({ success: false, error: 'Ranking ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // If itemId is provided, return vote information for that item
    if (itemId) {
      // If userId is provided, get the user's specific vote
      if (userId) {
        const vote = await getVote(userId, rankingId, parseInt(itemId));
        return NextResponse.json({ success: true, vote });
      } else {
        // Otherwise get the vote summary for this item
        const summary = await getVoteSummary(rankingId, parseInt(itemId));
        return NextResponse.json({ success: true, summary });
      }
    }
    
    // Use the robust search query helper
    const searchQuery = createRankingSearchQuery(rankingId);
    
    // If no itemId is provided, return the ranking details
    const ranking = await Ranking.findOne(searchQuery).lean();
    
    if (!ranking) {
      return NextResponse.json({ success: false, error: 'Ranking not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, ranking });
  } catch (error: any) {
    console.error('Error retrieving ranking:', error);
    
    // Handle specific ObjectId casting errors
    if (error.message && error.message.includes('Cast to ObjectId failed')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ranking ID format'
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve ranking' },
      { status: 500 }
    );
  }
}

// POST handler to add or update a vote
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rankingId } = await params;
    const body = await request.json();
    const { userId, itemId, direction } = body;

    if (!rankingId || !userId || itemId === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: rankingId, userId, and itemId are required' },
        { status: 400 }
      );
    }

    if (direction !== 'up' && direction !== 'down' && direction !== null) {
      return NextResponse.json(
        { success: false, error: 'Direction must be "up", "down", or null to remove vote' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Use the robust search query helper
    const searchQuery = createRankingSearchQuery(rankingId);

    // Then update the findOne call with proper typing
    const ranking = await Ranking.findOne(searchQuery).lean() as unknown as RankingDocument;

    if (!ranking) {
      return NextResponse.json({ success: false, error: 'Ranking not found' }, { status: 404 });
    }

    // Find the item in the ranking
    const item = ranking.items.find((item: any) => item.id === itemId);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found in ranking' }, { status: 404 });
    }

    // Get previous vote if it exists
    const previousVote = await getVote(userId, rankingId, itemId);
    
    // Calculate vote change
    const voteChange = calculateVoteChange(previousVote, direction);
    
    // Update or create the vote
    const metadata = {
      rankingTitle: ranking.title,
      itemName: item.name,
      category: ranking.category
    };
    
    const vote = await upsertVote(userId, rankingId, itemId, direction, metadata);

    // Update the item's vote count in the ranking if there was a change
    if (voteChange !== 0) {
      await Ranking.updateOne(
        searchQuery,
        { $inc: { 'items.$[elem].votes': voteChange } },
        { arrayFilters: [{ 'elem.id': itemId }] }
      );
    }

    return NextResponse.json({ 
      success: true, 
      vote, 
      voteChange
    });
  } catch (error: any) {
    console.error('Error processing vote:', error);
    
    // Handle specific ObjectId casting errors
    if (error.message && error.message.includes('Cast to ObjectId failed')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ranking ID format'
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process vote' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a vote
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rankingId = params.id;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const itemId = url.searchParams.get('itemId');

    if (!rankingId || !userId || !itemId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: rankingId, userId, and itemId are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Build search query based on whether the ID is a valid ObjectId or custom string ID
    let searchQuery;
    if (isValidObjectId(rankingId)) {
      searchQuery = {
        $or: [
          { _id: new mongoose.Types.ObjectId(rankingId) },
          { id: rankingId }
        ]
      };
    } else {
      searchQuery = { id: rankingId };
    }

    // Get previous vote if it exists
    const previousVote = await getVote(userId, rankingId, parseInt(itemId));
    
    // Calculate vote change (removing vote)
    const voteChange = calculateVoteChange(previousVote, null);
    
    // Delete the vote
    const result = await upsertVote(userId, rankingId, parseInt(itemId), null);

    // Update the item's vote count in the ranking if there was a change
    if (voteChange !== 0) {
      await Ranking.updateOne(
        searchQuery,
        { $inc: { 'items.$[elem].votes': voteChange } },
        { arrayFilters: [{ 'elem.id': parseInt(itemId) }] }
      );
    }

    return NextResponse.json({ 
      success: true, 
      result, 
      voteChange 
    });
  } catch (error: any) {
    console.error('Error deleting vote:', error);
    
    // Handle specific ObjectId casting errors
    if (error.message && error.message.includes('Cast to ObjectId failed')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ranking ID format'
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete vote' },
      { status: 500 }
    );
  }
}