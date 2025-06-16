import { NextRequest, NextResponse } from 'next/server';
import { getUserVotes, getVote } from '@/lib/database/model/votes.js';
import { currentUser } from '@clerk/nextjs/server';

// GET /api/user/votes - Get user's votes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rankingId = searchParams.get('rankingId');
    const itemId = searchParams.get('itemId');
    let userId = searchParams.get('userId');

    // Try to get authenticated user, but don't fail if Clerk middleware isn't working
    let user = null;
    try {
      user = await currentUser();
      if (user && !userId) {
        userId = user.id;
      }
    } catch (clerkError) {
      console.warn('Clerk authentication not available:', clerkError);
      // Continue with provided userId if available
    }

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required. Please provide userId parameter or ensure authentication is working.' 
      }, { status: 400 });
    }

    // If we have an authenticated user, validate access
    if (user && userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (rankingId && itemId) {
      // Get specific vote for ranking item
      const vote = await getVote(userId, rankingId, parseInt(itemId));
      return NextResponse.json({ success: true, vote });
    } else if (rankingId) {
      // Get all votes for a specific ranking
      const allVotes = await getUserVotes(userId);
      const rankingVotes = allVotes.filter(vote => vote.rankingId === rankingId);
      return NextResponse.json({ success: true, votes: rankingVotes });
    } else {
      // Get all user votes
      const votes = await getUserVotes(userId);
      return NextResponse.json({ success: true, votes });
    }
  } catch (error: any) {
    console.error('Error in GET /api/user/votes:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch votes',
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}

