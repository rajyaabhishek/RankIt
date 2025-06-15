"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, AlertTriangle, Home, CreditCard, RefreshCw } from 'lucide-react'
import Link from 'next/link'

type PaymentStatus = 'success' | 'failed' | 'pending' | 'verifying' | 'error'

interface PaymentDetails {
  payment_status: string
  payment_amount: number
  payment_currency: string
  payment_id: string
  payment_method: string
  cf_payment_id: number
  order_id: string
  entity: string
  is_payment_gateway_fee_applicable: boolean
  payment_gateway_fee: number
  payment_gateway_discount: number
  [key: string]: any
}

function PaymentReturnContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const urlStatus = searchParams.get('status')
  
  const [status, setStatus] = useState<PaymentStatus>('verifying')
  const [message, setMessage] = useState('Verifying your payment...')
  const [details, setDetails] = useState<PaymentDetails | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const verifyPayment = async (retryAttempt = 0) => {
    if (!orderId) {
      setStatus('error')
      setMessage('No order ID provided. Please contact support if payment was deducted.')
      return
    }

    // If status is already provided in URL as success, still verify with server
    if (urlStatus === 'success') {
      console.log('✅ URL indicates success, verifying with server...')
    }

    try {
      console.log(`🔍 Verifying payment for order: ${orderId} (attempt ${retryAttempt + 1})`)
      
      const serverUrl = process.env.NODE_ENV === 'production' 
        ? 'https://rankit-z5g4.onrender.com' 
        : 'http://localhost:5000';
      
      const response = await fetch(`${serverUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Verification request failed:', response.status, errorText)
        throw new Error(`Verification request failed: ${response.status}`)
      }

      const result = await response.json()
      console.log('📋 Verification result:', result)
      
      if (result && result.length > 0) {
        const payment = result[0] as PaymentDetails
        setDetails(payment)
        
        switch (payment.payment_status) {
          case 'SUCCESS':
            setStatus('success')
            setMessage('🎉 Payment completed successfully! Your premium subscription is now active.')
            
            // Dispatch global event for subscription update
            window.dispatchEvent(new CustomEvent('subscriptionUpdated', {
              detail: { 
                success: true, 
                orderId, 
                amount: payment.payment_amount,
                currency: payment.payment_currency 
              }
            }))
            break
            
          case 'FAILED':
            setStatus('failed')
            setMessage('❌ Payment failed. No charges were made to your account.')
            break
            
          case 'PENDING':
            setStatus('pending')
            setMessage('⏳ Payment is being processed. This usually takes a few moments...')
            
            // Auto-retry for pending payments (max 3 times)
            if (retryAttempt < 3) {
              setTimeout(() => {
                setRetryCount(retryAttempt + 1)
                verifyPayment(retryAttempt + 1)
              }, 5000) // Retry after 5 seconds
            }
            break
            
          case 'CANCELLED':
            setStatus('failed')
            setMessage('❌ Payment was cancelled. No charges were made to your account.')
            break
            
          default:
            setStatus('error')
            setMessage(`⚠️ Unknown payment status: ${payment.payment_status}. Please contact support.`)
        }
      } else {
        // No payment found - might be too early or order doesn't exist
        if (retryAttempt < 2) {
          setStatus('verifying')
          setMessage('🔄 Payment verification in progress...')
          setTimeout(() => {
            setRetryCount(retryAttempt + 1)
            verifyPayment(retryAttempt + 1)
          }, 3000)
        } else {
          setStatus('error')
          setMessage('⚠️ Payment verification failed. Please contact support if payment was deducted.')
        }
      }
    } catch (error: any) {
      console.error('❌ Payment verification error:', error)
      
      if (retryAttempt < 2) {
        setStatus('verifying')
        setMessage('🔄 Retrying payment verification...')
        setTimeout(() => {
          setRetryCount(retryAttempt + 1)
          verifyPayment(retryAttempt + 1)
        }, 3000)
      } else {
        setStatus('error')
        setMessage('⚠️ Failed to verify payment. Please contact support if payment was deducted.')
      }
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [orderId, urlStatus])

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-400" />
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-400" />
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-400 animate-pulse" />
      case 'verifying':
        return (
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
            <CreditCard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
          </div>
        )
      case 'error':
      default:
        return <AlertTriangle className="h-16 w-16 text-orange-400" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      case 'failed':
        return 'from-red-500/20 to-rose-500/20 border-red-500/30'
      case 'pending':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
      case 'verifying':
        return 'from-primary/20 to-blue-500/20 border-primary/30'
      case 'error':
      default:
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30'
    }
  }

  const formatAmount = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  const getNextSteps = () => {
    switch (status) {
      case 'success':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/premium">
                  View Premium Features
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              You can now access all premium features. Enjoy RankIt Premium! 🎉
            </p>
          </div>
        )
      
      case 'failed':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => window.location.href = '/premium'}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              No charges were made. You can try again or contact support if needed.
            </p>
          </div>
        )
      
      case 'pending':
        return (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => verifyPayment()}
              disabled={false}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Status Again
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {retryCount > 0 && `Retry ${retryCount}/3 - `}
              We're automatically checking your payment status...
            </p>
          </div>
        )
      
      case 'verifying':
        return (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-pulse text-muted-foreground">
                Please wait while we verify your payment...
              </div>
            </div>
          </div>
        )
      
      case 'error':
      default:
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="default" 
                onClick={() => verifyPayment()}
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Verification
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              If payment was deducted, please contact support with order ID: {orderId}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className={`border-2 bg-gradient-to-br ${getStatusColor()} backdrop-blur-sm`}>
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === 'success' && 'Payment Successful!'}
              {status === 'failed' && 'Payment Failed'}
              {status === 'pending' && 'Payment Pending'}
              {status === 'verifying' && 'Verifying Payment'}
              {status === 'error' && 'Verification Error'}
            </CardTitle>
            <CardDescription className="text-center px-2">
              {message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Payment Details */}
            {details && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{details.order_id}</span>
                </div>
                {details.payment_amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">
                      {formatAmount(details.payment_amount, details.payment_currency)}
                    </span>
                  </div>
                )}
                {details.payment_method && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Method:</span>
                    <span>{details.payment_method}</span>
                  </div>
                )}
                {details.cf_payment_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment ID:</span>
                    <span className="font-mono text-xs">{details.cf_payment_id}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Order ID for reference (even without full details) */}
            {orderId && !details && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{orderId}</span>
                </div>
              </div>
            )}
            
            {/* Next Steps */}
            {getNextSteps()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentReturn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentReturnContent />
    </Suspense>
  )
} 