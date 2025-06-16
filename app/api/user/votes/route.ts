import { NextResponse } from 'next/server';
import { getUserVotes, upsertVote, deleteUserVotes } from '@/lib/database/model/votes';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    // Extract userId from query params first
    const url = new URL(request.url);
    const queryUserId = url.searchParams.get('userId');
    
    let userId = queryUserId;
    
    // Try to get authenticated user as fallback
    try {
      const user = await currentUser();
      if (!userId && user?.id) {
        userId = user.id;
      }
    } catch (clerkError: any) {
      console.warn('Clerk authentication not available:', clerkError?.message || 'Unknown error');
      // Continue with queryUserId if available
    }

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required. Please provide userId parameter or sign in.' 
      }, { status: 400 });
    }

    const votes = await getUserVotes(userId);
    
    // Group votes by category and ranking
    const votesByCategory: Record<string, any[]> = {};
    const votesByRanking: Record<string, any[]> = {};
    
    votes.forEach(vote => {
      // Group by category - use direct category field
      const category = vote.category || 'Uncategorized';
      if (!votesByCategory[category]) {
        votesByCategory[category] = [];
      }
      votesByCategory[category].push(vote);
      
      // Group by ranking
      if (!votesByRanking[vote.rankingId]) {
        votesByRanking[vote.rankingId] = [];
      }
      votesByRanking[vote.rankingId].push(vote);
    });
    
    return NextResponse.json({ 
      success: true, 
      votes,
      votesByCategory,
      votesByRanking
    });
  } catch (error: any) {
    console.error('Error fetching user votes:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, rankingId, itemId, direction, metadata } = body;

    if (!userId || !rankingId || itemId === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, rankingId, and itemId are required' },
        { status: 400 }
      );
    }

    const result = await upsertVote(userId, rankingId, itemId, direction, metadata);
    return NextResponse.json({ success: true, vote: result });
  } catch (error: any) {
    console.error('Error upserting vote:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update vote' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const rankingId = url.searchParams.get('rankingId');
    const itemId = url.searchParams.get('itemId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // If rankingId and itemId are provided, delete a specific vote
    // Otherwise, delete all votes for the user
    let result;
    if (rankingId && itemId) {
      result = await upsertVote(userId, rankingId, parseInt(itemId), null);
    } else {
      result = await deleteUserVotes(userId);
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error deleting votes:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete votes' }, { status: 500 });
  }
}