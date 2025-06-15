import { NextRequest, NextResponse } from 'next/server';
import { getUserLikes, toggleLike, isRankingLiked } from '@/lib/database/model/likes';
import { currentUser } from '@clerk/nextjs/server';

// GET /api/user/likes - Get user's liked rankings
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const rankingId = searchParams.get('rankingId');

    if (rankingId) {
      // Check if specific ranking is liked
      const isLiked = await isRankingLiked(user.id, rankingId);
      return NextResponse.json({ success: true, liked: isLiked });
    } else {
      // Get all user likes
      const likes = await getUserLikes(user.id);
      return NextResponse.json({ success: true, likes });
    }
  } catch (error) {
    console.error('Error in GET /api/user/likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

// POST /api/user/likes - Toggle like on a ranking
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rankingId, rankingTitle, category, author } = body;

    if (!rankingId) {
      return NextResponse.json({ error: 'Ranking ID is required' }, { status: 400 });
    }

    const result = await toggleLike(user.id, rankingId, {
      rankingTitle,
      category,
      author
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in POST /api/user/likes:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
} 