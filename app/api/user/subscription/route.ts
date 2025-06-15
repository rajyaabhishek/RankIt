import { NextResponse } from 'next/server';
import { createClerkClient, currentUser } from '@clerk/nextjs/server';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }

    const { plan, billingCycle, status } = await request.json();

    if (!plan || !billingCycle || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: plan, billingCycle, status' }, 
        { status: 400 }
      );
    }

    // Calculate expiration date based on plan
    const now = new Date();
    let expiresAt: Date;
    
    if (billingCycle === 'monthly' || plan === 'monthly') {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    } else if (billingCycle === 'yearly' || plan === 'yearly') {
      expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid plan or billing cycle' }, 
        { status: 400 }
      );
    }

    // Update user's public metadata with premium subscription info
    const premiumData = {
      status: status,
      plan: billingCycle === 'monthly' ? 'monthly' : 'yearly',
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      updatedAt: now.toISOString(),
    };

    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        premium: premiumData,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription updated successfully',
      premiumData 
    });

  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update subscription' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }

    // Get premium data from user metadata
    const premiumData = user.publicMetadata?.premium as any;
    
    if (!premiumData) {
      return NextResponse.json({ 
        success: true, 
        premium: {
          status: 'inactive',
          plan: null,
          expiresAt: null,
          startedAt: null,
        }
      });
    }

    // Check if subscription is still active
    const now = new Date();
    const expiresAt = premiumData.expiresAt ? new Date(premiumData.expiresAt) : null;
    const isActive = expiresAt ? expiresAt > now : false;

    return NextResponse.json({ 
      success: true, 
      premium: {
        ...premiumData,
        status: isActive ? 'active' : 'expired',
      }
    });

  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subscription' }, 
      { status: 500 }
    );
  }
} 