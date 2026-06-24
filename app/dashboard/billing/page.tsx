import { createClient } from "@/lib/supabase/server";
import { getUserPaymentHistory, getUserActiveSubscription } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, CreditCard, Crown, Zap } from "lucide-react";
import Link from "next/link";
import { CancelSubscriptionButton } from "@/components/billing/cancel-subscription-button";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [paymentHistory, activeSubscription] = await Promise.all([
    getUserPaymentHistory(user.id),
    getUserActiveSubscription(user.id)
  ]);

  const formatDate = (date: Date | string | null) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert cents to dollars
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <Crown className="h-4 w-4" />;
      case 'lifetime':
        return <Zap className="h-4 w-4" />;
      case 'single_course':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'Pro Subscription';
      case 'lifetime':
        return 'Lifetime Access';
      case 'single_course':
        return 'Single Course';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-500 text-white">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Payments</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your subscription and view payment history.
        </p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSubscription ? (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {activeSubscription.subscriptionType === 'pro' ? 'Pro Monthly' : 'Lifetime Access'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeSubscription.subscriptionType === 'pro'
                    ? activeSubscription.status === 'canceled'
                      ? `Access until ${formatDate(activeSubscription.currentPeriodEnd)} (won't renew)`
                      : `Renews ${activeSubscription.currentPeriodEnd ? formatDate(activeSubscription.currentPeriodEnd) : 'automatically'}`
                    : 'Lifetime access to all courses'
                  }
                </p>
                <Badge 
                  className={`mt-2 ${
                    activeSubscription.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {activeSubscription.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {activeSubscription.subscriptionType === 'pro' ? '$10/mo' : '$99'}
                </p>
                {activeSubscription.subscriptionType === 'pro' && (
                  <CancelSubscriptionButton
                    isCanceling={activeSubscription.status === 'canceled'}
                    currentPeriodEnd={
                      activeSubscription.currentPeriodEnd
                        ? new Date(activeSubscription.currentPeriodEnd).toISOString()
                        : null
                    }
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="font-semibold text-lg mb-2">No Active Subscription</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upgrade to Pro or get Lifetime Access to unlock all courses.
              </p>
              <Button asChild>
                <Link href="/dashboard/membership">
                  <Crown className="h-4 w-4 mr-2" />
                  Choose a Plan
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      {getTypeIcon(payment.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {payment.type === 'single_course' && payment.lessonTitle 
                          ? payment.lessonTitle 
                          : getTypeName(payment.type)
                        }
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(payment.amount, payment.currency)}
                      </p>
                      {getStatusBadge(payment.status)}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold text-lg mb-2">No Payment History</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your payment history will appear here once you make your first purchase.
              </p>
              <Button asChild>
                <Link href="/dashboard/membership">
                  Start Learning Today
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Billing Questions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you have any questions about your billing or need to request a refund, 
                please contact our support team.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:support@type-cn.com">
                  Contact Support
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#" target="_blank">
                  View Terms
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 