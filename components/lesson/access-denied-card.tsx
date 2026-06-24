'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccessDeniedCardProps {
  lessonId: string;
}

export function AccessDeniedCard({ lessonId }: AccessDeniedCardProps) {
  const router = useRouter();

  const handlePurchaseCourse = async () => {
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'single_course', lessonId }),
      });
      
      const data = await response.json();
      if (data.success) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Lock className="h-16 w-16 mx-auto mb-4 text-orange-600" />
          <CardTitle className="text-2xl text-orange-600">Course Locked</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This course requires a subscription or purchase to access.
          </p>
          
          <div className="space-y-3">
            <Button onClick={handlePurchaseCourse} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Buy This Course
            </Button>
            
            <Button 
              onClick={() => router.push('/dashboard/membership')}
              variant="outline" 
              className="w-full"
            >
              <Crown className="h-4 w-4 mr-2" />
              Get Pro Access
            </Button>
            
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="ghost" 
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 