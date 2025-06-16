import { NextRequest, NextResponse } from 'next/server';
import { getUserLikes, toggleLike, isRankingLiked } from '@/lib/database/model/likes.js';
import { currentUser } from '@clerk/nextjs/server';

// GET /api/user/likes - Get user's liked rankings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rankingId = searchParams.get('rankingId');
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

    if (rankingId) {
      // Check if specific ranking is liked
      const isLiked = await isRankingLiked(userId, rankingId);
      return NextResponse.json({ success: true, liked: isLiked });
    } else {
      // Get all user likes
      const likes = await getUserLikes(userId);
      return NextResponse.json({ success: true, likes });
    }
  } catch (error: any) {
    console.error('Error in GET /api/user/likes:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch likes',
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}

// POST /api/user/likes - Toggle like on a ranking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rankingId, rankingTitle, category, author, userId } = body;

    // Try to get authenticated user, but don't fail if Clerk middleware isn't working
    let user = null;
    let finalUserId = userId;
    try {
      user = await currentUser();
      if (user && !finalUserId) {
        finalUserId = user.id;
      }
    } catch (clerkError) {
      console.warn('Clerk authentication not available:', clerkError);
      // Continue with provided userId if available
    }

    if (!finalUserId) {
      return NextResponse.json({ 
        error: 'User ID is required. Please provide userId in request body or ensure authentication is working.' 
      }, { status: 400 });
    }

    if (!rankingId) {
      return NextResponse.json({ error: 'Ranking ID is required' }, { status: 400 });
    }

    // If we have an authenticated user, validate access
    if (user && finalUserId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const result = await toggleLike(finalUserId, rankingId, {
      rankingTitle,
      category,
      author
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error in POST /api/user/likes:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to toggle like',
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
} 