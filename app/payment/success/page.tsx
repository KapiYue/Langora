'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

const VERIFY_TIMEOUT_MS = 10000; // 10s 超时
const POLL_INTERVAL_MS = 1500;

interface PaymentStatusResponse {
  success?: boolean;
  status?: string;
  metadata?: { paymentType?: string };
  [key: string]: unknown;
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentStatusResponse | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const checkoutId = searchParams.get('checkout_id');
    const returnedStatus = searchParams.get('status');

    // 没有 checkout_id 无法校验
    if (!checkoutId) {
      router.replace('/payment/fail?reason=invalid');
      return;
    }

    // Creem 直接在 return url 中告知失败
    if (returnedStatus && ['failed', 'canceled'].includes(returnedStatus)) {
      router.replace(`/payment/fail?reason=${returnedStatus}`);
      return;
    }

    const deadline = Date.now() + VERIFY_TIMEOUT_MS;

    const poll = async () => {
      while (!cancelledRef.current && Date.now() < deadline) {
        try {
          const response = await fetch(`/api/payment/status?checkout_id=${checkoutId}`);
          const data = await response.json();

          if (data.success && data.status === 'completed') {
            if (!cancelledRef.current) {
              setPaymentDetails(data);
              setPaymentStatus('success');
            }
            return;
          }
        } catch (error) {
          console.error('Payment verification attempt failed:', error);
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      // 超时仍未成功 → 跳转失败页
      if (!cancelledRef.current) {
        const type = searchParams.get('type') || '';
        router.replace(`/payment/fail?reason=timeout${type ? `&type=${type}` : ''}`);
      }
    };

    poll();

    return () => {
      cancelledRef.current = true;
    };
  }, [searchParams, router]);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-blue-600" />
              <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we confirm your payment...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paymentType = paymentDetails?.metadata?.paymentType;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your purchase! Your payment has been processed successfully.
          </p>

          {paymentType === 'single_course' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You now have access to your purchased course. Start learning right away!
              </p>
            </div>
          )}

          {paymentType === 'subscription' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-800 dark:text-green-200">
                Your Pro subscription is now active! You have access to all courses.
              </p>
            </div>
          )}

          {paymentType === 'lifetime' && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Congratulations! You now have lifetime access to all courses.
              </p>
            </div>
          )}

          <Button onClick={handleBackToDashboard} className="w-full" size="lg">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
