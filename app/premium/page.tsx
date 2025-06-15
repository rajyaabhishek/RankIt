'use client';

import React from 'react';
import PaymentButton from '@/components/PaymentButton';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Calendar } from 'lucide-react';
import { usePremium } from '@/hooks/use-premium';


const PremiumPage = () => {
  const { isSignedIn, user } = useUser();
  const { isPremium, isExpired, isLoading, daysRemaining, plan: userPlan, expiresAt } = usePremium();

  // Handle successful subscription
  const handleSubscriptionSuccess = async (plan: string, billingCycle: string) => {
    if (!user) return;
    
    try {
      // Calculate expiration date
      const startDate = new Date();
      const expirationDate = new Date();
      
      if (billingCycle === 'monthly') {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else if (billingCycle === 'yearly') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }

      // Update user metadata with premium subscription
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          premium: {
            status: 'active',
            plan: billingCycle,
            startedAt: startDate.toISOString(),
            expiresAt: expirationDate.toISOString(),
            lastPayment: new Date().toISOString()
          }
        }
      });

      // Reload user to get updated metadata
      await user.reload();
      

      
      // Show success notification
      alert(`🎉 Premium ${billingCycle} subscription activated successfully! Your premium features are now available.`);
      
    } catch (error) {
      console.error('Failed to update premium status:', error);
      alert('Payment successful but there was an error activating your premium subscription. Please contact support.');
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$5',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Unlimited rankings',
        'Edit your rankings (add/remove items)',
        'Priority support',
        'No ads',
        'Advanced features'
      ],
      planType: 'monthly' as const,
      popular: false
    },
    {
      id: 'yearly',
      name: 'Annual',
      price: '$45',
      period: '/year',
      description: 'Save $15 with annual billing',
      features: [
        'All monthly features',
        'Full ranking editing capabilities',
        'Save $15 yearly',
        'Early access',
        'Exclusive features'
      ],
      planType: 'yearly' as const,
      popular: true,
 
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-yellow animate-pulse mx-auto mb-4" />
          <p className="text-navy">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">


          {/* Current subscription status */}
          {isSignedIn && isPremium && (
            <div className="mb-12">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Crown className="h-5 w-5 text-yellow" />
                      <div>
                        <Badge className="bg-yellow text-navy font-bold mb-1">
                          {userPlan?.toUpperCase()} PLAN
                        </Badge>
                        <p className="text-navy/60 text-sm">
                          {daysRemaining} days remaining
                        </p>
                      </div>
                    </div>
                    {expiresAt && (
                      <p className="text-sm text-navy/60">
                        Renews: {new Date(expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pricing plans */}
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all hover:scale-[1.02] ${
                  plan.popular 
                    ? 'bg-yellow/5 border-2 border-yellow' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  
                  </div>
                )}
                
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl font-bold text-navy">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-navy/60">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline justify-center gap-1 mt-4">
                    <span className="text-4xl font-bold text-navy">{plan.price}</span>
                    <span className="text-navy/60">{plan.period}</span>
                  </div>
                 
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-yellow flex-shrink-0" />
                        <span className="text-navy/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isSignedIn ? (
                    isPremium && userPlan === plan.planType ? (
                      <div className="w-full p-3 text-center bg-yellow/10 text-navy rounded-lg font-bold">
                        Current Plan
                      </div>
                    ) : (
                      <PaymentButton 
                        planType={plan.planType}
                        onSuccess={handleSubscriptionSuccess}
                        className={`w-full py-3 font-bold transition-all ${
                          plan.popular
                            ? 'bg-yellow hover:bg-yellow/90 text-navy'
                            : 'bg-navy hover:bg-navy/90 text-white'
                        }`}
                      />
                    )
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-navy/60 text-sm">Sign in to subscribe</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-navy/60 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-yellow" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-yellow" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-yellow" />
                <span>Enjoy Rankings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage; 