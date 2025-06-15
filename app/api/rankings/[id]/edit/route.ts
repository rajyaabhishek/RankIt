import { NextResponse } from 'next/server';
import { Ranking, connectToDatabase } from '@/lib/database/model/rankings';
import { currentUser } from '@clerk/nextjs/server';

// PUT handler to edit ranking items
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rankingId = params.id;
    const { items } = await request.json();

    if (!rankingId) {
      return NextResponse.json({ success: false, error: 'Ranking ID is required' }, { status: 400 });
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Items array is required' }, { status: 400 });
    }

    // Get the authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }

    // Check if user has premium subscription
    const premiumData = user.publicMetadata?.premium as any;
    const isPremium = premiumData && premiumData.status === 'active' && 
                     new Date(premiumData.expiresAt) > new Date();
    
    if (!isPremium) {
      return NextResponse.json({ 
        success: false, 
        error: 'Premium subscription required to edit rankings' 
      }, { status: 403 });
    }

    await connectToDatabase();

    // Find the ranking and verify ownership
    const ranking = await Ranking.findOne({
      $or: [
        { _id: rankingId },
        { id: rankingId }
      ]
    });

    if (!ranking) {
      return NextResponse.json({ success: false, error: 'Ranking not found' }, { status: 404 });
    }

    // Check if the user owns this ranking
    if (ranking.author.name !== user.username) {
      return NextResponse.json({ 
        success: false, 
        error: 'You can only edit your own rankings' 
      }, { status: 403 });
    }

    // Process the items to assign proper IDs
    const processedItems = items.map((item: any, index: number) => {
      // If it's a new item (has a timestamp ID), assign a proper sequential ID
      const isNewItem = item.id > 1000000000000; // Timestamp-based IDs are large numbers
      const maxId = ranking.items.length > 0 ? Math.max(...ranking.items.map((i: any) => i.id)) : 0;
      
      return {
        id: isNewItem ? maxId + index + 1 : item.id,
        name: item.name.trim(),
        description: item.description?.trim() || undefined,
        votes: item.votes || 0
      };
    });

    // Update the ranking with new items
    const updatedRanking = await Ranking.findOneAndUpdate(
      {
        $or: [
          { _id: rankingId },
          { id: rankingId }
        ]
      },
      {
        $set: {
          items: processedItems,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedRanking) {
      return NextResponse.json({ success: false, error: 'Failed to update ranking' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      ranking: updatedRanking,
      message: 'Ranking updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating ranking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update ranking' }, 
      { status: 500 }
    );
  }
} 