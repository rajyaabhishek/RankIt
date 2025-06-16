import { Ranking, connectToDatabase } from '@/lib/database/model/rankings.js';
import {
  calculateVoteChange,
  getVote,
  getVoteSummary,
  upsertVote
} from '@/lib/database/model/votes.js';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Updated interface with optional fields to match Mongoose response
interface RankingDocument {
  _id: string;
  id: string;
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

// GET handler to get vote summary for an item
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

    if (itemId) {
      if (userId) {
        // Get user's specific vote
        const vote = await getVote(userId, rankingId, parseInt(itemId));
        return NextResponse.json({ success: true, vote });
      } else {
        // Get vote summary for item
        const summary = await getVoteSummary(rankingId, parseInt(itemId));
        return NextResponse.json({ success: true, summary });
      }
    }

    return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
  } catch (error: any) {
    console.error('Error retrieving votes:', error);
    
    // Handle specific ObjectId casting errors
    if (error.message && error.message.includes('Cast to ObjectId failed')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ranking ID format'
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve votes' },
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
    let { userId, itemId, direction } = body;
    
    // If userId is not provided in the request, try to get it from Clerk auth
    if (!userId) {
      try {
        const user = await currentUser();
        if (user?.id) {
          userId = user.id;
        } else {
          return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
        }
      } catch (clerkError: any) {
        console.warn('Clerk authentication failed:', clerkError?.message || 'Unknown error');
        return NextResponse.json({ 
          success: false, 
          error: 'Authentication required. Please provide userId in request body or sign in.' 
        }, { status: 401 });
      }
    }

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

    // Get the ranking info for metadata
    const ranking = await Ranking.findOne(searchQuery).lean() as unknown as RankingDocument;

    if (!ranking) {
      return NextResponse.json({ success: false, error: 'Ranking not found' }, { status: 404 });
    }

    // Convert itemId to number if it's a string to ensure consistent comparison
    const numericItemId = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;
    
    // Find the item in the ranking
    const item = ranking.items.find(item => item.id === numericItemId);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found in ranking' }, { status: 404 });
    }

    // Get previous vote if it exists
    const previousVote = await getVote(userId, rankingId, numericItemId);
    
    // Calculate vote change
    const voteChange = calculateVoteChange(previousVote, direction);
    
    // Update or create the vote
    const vote = await upsertVote(
      userId, 
      rankingId, 
      numericItemId, 
      direction, 
      {
        rankingTitle: ranking.title,
        itemName: item.name,
        category: ranking.category // Store category directly on vote document
      }
    );

    // Update the item's vote count in the ranking if there was a change
    if (voteChange !== 0) {
      await Ranking.updateOne(
        searchQuery,
        { $inc: { 'items.$[elem].votes': voteChange } },
        { arrayFilters: [{ 'elem.id': numericItemId }] }
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
    let userId = url.searchParams.get('userId');
    const itemId = url.searchParams.get('itemId');
    
    // If userId is not provided in the request, get it from Clerk auth
    if (!userId) {
      const user = await currentUser();
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
      }
      const clerkUserId = user.id;
      userId = clerkUserId;

    }

    if (!rankingId || !userId || !itemId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: rankingId, userId, and itemId are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Convert itemId to number
    const numericItemId = parseInt(itemId, 10);

    // Get previous vote if it exists
    const previousVote = await getVote(userId, rankingId, numericItemId);
    
    // Calculate vote change (removing vote)
    const voteChange = calculateVoteChange(previousVote, null);
    
    // Delete the vote
    const result = await upsertVote(userId, rankingId, numericItemId, null);

    // Update the item's vote count in the ranking if there was a change
    if (voteChange !== 0) {
      await Ranking.updateOne(
        { 
          $or: [
            { _id: rankingId },
            { id: rankingId }
          ],
          'items.id': numericItemId 
        },
        { $inc: { 'items.$.votes': voteChange } }
      );
    }

    return NextResponse.json({ 
      success: true, 
      result, 
      voteChange 
    });
  } catch (error: any) {
    console.error('Error deleting vote:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete vote' },
      { status: 500 }
    );
  }
}