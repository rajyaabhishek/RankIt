'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface PremiumSubscription {
  status: 'active' | 'inactive' | 'expired';
  plan: 'monthly' | 'yearly' | null;
  expiresAt: string | null;
  startedAt: string | null;
}

export function usePremium() {
  const { user, isLoaded } = useUser();
  const [premiumStatus, setPremiumStatus] = useState<PremiumSubscription>({
    status: 'inactive',
    plan: null,
    expiresAt: null,
    startedAt: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setPremiumStatus({
        status: 'inactive',
        plan: null,
        expiresAt: null,
        startedAt: null,
      });
      setIsLoading(false);
      return;
    }

    // Get premium data from Clerk unsafe metadata
    const premiumData = user.unsafeMetadata?.premium as any;
    
    if (!premiumData) {
      setPremiumStatus({
        status: 'inactive',
        plan: null,
        expiresAt: null,
        startedAt: null,
      });
      setIsLoading(false);
      return;
    }

    const now = new Date();
    const expiresAt = premiumData.expiresAt ? new Date(premiumData.expiresAt) : null;
    
    // Check if subscription is still active
    const isActive = expiresAt ? expiresAt > now : false;
    
    setPremiumStatus({
      status: isActive ? 'active' : 'expired',
      plan: premiumData.plan || null,
      expiresAt: premiumData.expiresAt || null,
      startedAt: premiumData.startedAt || null,
    });
    
    setIsLoading(false);
  }, [user, isLoaded]);

  // Listen for subscription updates
  useEffect(() => {
    const handleSubscriptionUpdate = async () => {
      // Reload user data to get updated metadata
      if (user) {
        try {
          await user.reload();

          
          // Force a re-check of premium status
          const premiumData = user.unsafeMetadata?.premium as any;
          
          if (premiumData) {
            const now = new Date();
            const expiresAt = premiumData.expiresAt ? new Date(premiumData.expiresAt) : null;
            const isActive = expiresAt ? expiresAt > now : false;
            
            setPremiumStatus({
              status: isActive ? 'active' : 'expired',
              plan: premiumData.plan || null,
              expiresAt: premiumData.expiresAt || null,
              startedAt: premiumData.startedAt || null,
            });
          }
        } catch (error) {
          console.error('Failed to reload user data:', error);
        }
      }
    };

    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    
    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    };
  }, [user]);

  const isPremium = premiumStatus.status === 'active';
  const isExpired = premiumStatus.status === 'expired';
  
  // Calculate days remaining for active subscriptions
  const daysRemaining = premiumStatus.expiresAt 
    ? Math.max(0, Math.ceil((new Date(premiumStatus.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    isPremium,
    isExpired,
    isLoading,
    premiumStatus,
    daysRemaining,
    plan: premiumStatus.plan,
    expiresAt: premiumStatus.expiresAt,
    startedAt: premiumStatus.startedAt,
  };
} 