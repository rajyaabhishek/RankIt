"use client"

import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

interface PaymentButtonProps {
  planType: 'monthly' | 'yearly';
  onSuccess?: (plan: string, billingCycle: string) => Promise<void>;
  className?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ planType, onSuccess, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();

  // Pricing configuration
  const PRICING = {
    monthly: {
      price: 415.00,
      currency: 'INR',
      description: 'Premium Monthly Plan',
      displayPrice: '$5/month'
    },
    yearly: {
      price: 3735.00,
      currency: 'INR',
      description: 'Premium Yearly Plan',
      displayPrice: '$45/year',
      savings: 'Save $15!'
    }
  };

  const selectedPlan = PRICING[planType];

  // Function to handle subscription success and notification
  const handleSubscriptionSuccess = async (plan: string, billingCycle: string) => {
    let subscriptionUpdated = false;
    
    if (onSuccess) {
      try {
        await onSuccess(plan, billingCycle);
        subscriptionUpdated = true;
      } catch (callbackError) {
        console.error('Callback error:', callbackError);
      }
    }
    
    // Check for global success handler
    if (!subscriptionUpdated && (window as any).handleSubscriptionSuccess) {
      try {
        await (window as any).handleSubscriptionSuccess(plan, billingCycle);
        subscriptionUpdated = true;
      } catch (globalError) {
        console.error('Global error:', globalError);
      }
    }
    
    if (subscriptionUpdated) {
      window.dispatchEvent(new CustomEvent('subscriptionUpdated', {
        detail: { plan, billingCycle, success: true }
      }));
      return true;
    } else {
      return false;
    }
  };

  const handlePayment = async () => {
    if (!isSignedIn || !user) {
      setError('Please sign in to make a payment');
      return;
    }

    setIsLoading(true);
    setError(null);
    let notificationShown = false;
    
    try {
      // Load Cashfree SDK dynamically
      const { load } = await import('@cashfreepayments/cashfree-js');
      
      console.log('Environment check:', {
        CASHFREE_ENVIRONMENT: process.env.REACT_APP_CASHFREE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
      });

      const cashfree = await load({
        mode: process.env.REACT_APP_CASHFREE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
      });

      console.log('Cashfree loaded successfully:', cashfree);

      const queryParams = new URLSearchParams({
        planType: planType,
        userEmail: user?.primaryEmailAddress?.emailAddress || 'customer@example.com',
        userName: user?.fullName || user?.firstName || 'Customer Name',
        userPhone: user?.phoneNumbers?.[0]?.phoneNumber || '9999999999',
        userId: user?.id || `cust_${Math.floor(Math.random() * 1000000)}`
      });
      
      const paymentUrl = process.env.REACT_APP_API_URL 
        ? `${process.env.REACT_APP_API_URL}/payment?${queryParams}`
        : process.env.NODE_ENV === 'production' 
          ? `https://rankit-z5g4.onrender.com/payment?${queryParams}`
          : `http://localhost:8000/payment?${queryParams}`;
      
      console.log('Making payment request to:', paymentUrl);
      
      const response = await fetch(paymentUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment request failed:', response.status, response.statusText, errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.setup_required) {
            throw new Error('Cashfree credentials not configured. Please check server logs for setup instructions.');
          }
        } catch (parseError) {
          // Ignore parse error, use original error
        }
        
        throw new Error(`Failed to create order: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const orderData = await response.json();
      console.log('Order created successfully:', orderData);
      
      if (!orderData.payment_session_id) {
        console.error('Invalid order response:', orderData);
        throw new Error('Invalid response from payment server: missing payment_session_id');
      }
      
      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: '_modal',
        onSuccess: async (data: any) => {
          console.log('Payment success callback:', data);
          setIsLoading(false);
          
          try {
            const verifyUrl = process.env.REACT_APP_API_URL 
              ? `${process.env.REACT_APP_API_URL}/verify`
              : process.env.NODE_ENV === 'production' 
                ? 'https://rankit-z5g4.onrender.com/verify'
                : 'http://localhost:8000/verify';
              
            const verifyResponse = await fetch(verifyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                orderId: orderData.order_id
              })
            });
            
            if (!verifyResponse.ok) {
              throw new Error(`Verification failed: ${verifyResponse.status}`);
            }

            const verificationResult = await verifyResponse.json();
            console.log('Verification result:', verificationResult);
            
            if (verificationResult && verificationResult.length > 0) {
              const payment = verificationResult[0];
              
              if (payment.payment_status === 'SUCCESS') {
                notificationShown = await handleSubscriptionSuccess(selectedPlan.description, planType);
              }
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
          }
        },
        onFailure: (data: any) => {
          console.log('Payment failure callback:', data);
          setIsLoading(false);
          setError('Payment failed. Please try again.');
        },
        onClose: () => {
          console.log('Payment modal closed');
          setIsLoading(false);
        }
      };

      console.log('Initiating Cashfree checkout with options:', checkoutOptions);
      const result = await (cashfree as any).checkout(checkoutOptions);
      console.log('Checkout result:', result);
      
      if (result && result.paymentDetails && result.paymentDetails.paymentMessage === 'Payment finished. Check status.' && !notificationShown) {
        try {
          const verifyUrl = process.env.REACT_APP_API_URL 
            ? `${process.env.REACT_APP_API_URL}/verify`
            : process.env.NODE_ENV === 'production' 
              ? 'https://rankit-z5g4.onrender.com/verify'
              : 'http://localhost:8000/verify';
            
          const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              orderId: orderData.order_id
            })
          });

          if (verifyResponse.ok) {
            const verificationResult = await verifyResponse.json();
            
            if (verificationResult && verificationResult.length > 0) {
              const payment = verificationResult[0];
              
              if (payment.payment_status === 'SUCCESS') {
                await handleSubscriptionSuccess(selectedPlan.description, planType);
              }
            }
          }
          
        } catch (manualVerifyError) {
          console.error('Manual verification error:', manualVerifyError);
        }
      }
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(`Payment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-button-container">
      <button 
        onClick={handlePayment}
        disabled={isLoading || !isSignedIn}
        className={`payment-button ${className || ''}`}
        style={{
          backgroundColor: !isSignedIn ? '#ccc' : '#102030',
          color: 'white',
          border: 'none',
          padding: '0.75rem',
          borderRadius: '5px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: isLoading || !isSignedIn ? 'not-allowed' : 'pointer',
          opacity: isLoading || !isSignedIn ? 0.7 : 1,
          transition: 'all 0.3s ease',
          width: '100%',
        }}
        onMouseOver={(e) => {
          if (!isLoading && isSignedIn) {
            (e.target as HTMLButtonElement).style.backgroundColor = '#FEE715';
          }
        }}
        onMouseOut={(e) => {
          if (!isLoading && isSignedIn) {
            (e.target as HTMLButtonElement).style.backgroundColor = '#102030';
          }
        }}
        title={!isSignedIn ? 'Please sign in to purchase a subscription' : ''}
      >
        {isLoading ? 'Processing...' : !isSignedIn ? 'Sign In Required' : `Buy ${selectedPlan.displayPrice}`}
      </button>
      {error && (
        <div style={{
          color: 'red',
          fontSize: '0.9rem',
          marginTop: '0.5rem',
          padding: '0.5rem',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default PaymentButton; 