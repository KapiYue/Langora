'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, Home, Loader2 } from 'lucide-react';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 获取失败原因（如果有的话）
  const reason = searchParams.get('reason') || 'unknown';
  const lessonId = searchParams.get('lessonId');
  const paymentType = searchParams.get('type');

  const getFailureMessage = () => {
    switch (reason) {
      case 'timeout':
        return 'Payment verification timed out. Your payment may still be processing.';
      case 'canceled':
        return 'Payment was canceled by user.';
      case 'failed':
        return 'Payment failed. Please check your payment method and try again.';
      case 'invalid':
        return 'Invalid payment information provided.';
      default:
        return 'Payment could not be completed. Please try again or contact support.';
    }
  };

  const handleRetryPayment = () => {
    // 根据支付类型重新跳转
    if (paymentType === 'single_course' && lessonId) {
      router.push(`/dashboard/courses`);
    } else if (paymentType === 'subscription' || paymentType === 'lifetime') {
      router.push('/dashboard/membership');
    } else {
      router.push('/dashboard');
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
          <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getFailureMessage()}
          </p>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              What you can do:
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 text-left">
              <li>• Check your payment method details</li>
              <li>• Ensure sufficient funds are available</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRetryPayment}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleBackToDashboard}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Need help? Contact our support team at{' '}
              <a 
                href="mailto:support@joy-codex.com" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                support@joy-codex.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-16 w-16 animate-spin text-red-600" />
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
} 