'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { PAID_MEMBERSHIP_PLANS, type PlanId } from '@/lib/membership/plans';
import { usePaymentCheckout } from '@/hooks/use-payment-checkout';
import { useUserAccess } from '@/hooks/use-user-access';

export default function MembershipPage() {
  const { startCheckout, loadingType, error } = usePaymentCheckout();
  const { access, loading: accessLoading } = useUserAccess();

  // 根据用户当前会员状态，计算每个套餐按钮的展示与可点击状态
  const getPlanState = (planId: PlanId) => {
    if (accessLoading || !access) {
      return { label: 'Loading...', disabled: true, note: null as string | null };
    }

    if (access.isLifetime) {
      return planId === 'lifetime'
        ? { label: 'Current Plan', disabled: true, note: null }
        : { label: 'Included in Lifetime', disabled: true, note: null };
    }

    if (access.isPro) {
      if (planId === 'subscription') {
        return { label: 'Current Plan', disabled: true, note: null };
      }
      return {
        label: 'Upgrade to Lifetime',
        disabled: false,
        note: 'Your Pro subscription will be canceled automatically after upgrading.',
      };
    }

    return { label: null, disabled: false, note: null };
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Unlock unlimited access to all Chinese typing courses
        </p>
      </div>

      {!accessLoading && access?.hasUnlimitedAccess && (
        <div className="max-w-4xl mx-auto rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-center text-sm text-green-700 dark:text-green-300">
          {access.isLifetime
            ? 'You have Lifetime access — all courses are unlocked forever.'
            : 'You have an active Pro subscription with full access to all courses.'}
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-center text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {PAID_MEMBERSHIP_PLANS.map((plan) => {
          const Icon = plan.icon;
          const isLifetime = plan.id === 'lifetime';
          const state = getPlanState(plan.id);

          return (
            <Card
              key={plan.id}
              className={`relative border-2 transition-colors ${
                isLifetime
                  ? 'border-orange-500 hover:border-orange-600'
                  : 'hover:border-blue-500'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isLifetime
                      ? 'bg-orange-100 dark:bg-orange-900/20'
                      : 'bg-blue-100 dark:bg-blue-900/20'
                  }`}
                >
                  <Icon
                    className={`h-8 w-8 ${
                      isLifetime
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  />
                </div>
                <CardTitle
                  className={`text-2xl ${
                    isLifetime
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.period}
                  </div>
                  {isLifetime && (
                    <div className="text-xs text-green-600 mt-1">
                      Save $120+ vs monthly
                    </div>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isLifetime ? 'bg-orange-500 hover:bg-orange-600' : ''
                  }`}
                  onClick={() => startCheckout(plan.checkoutType)}
                  disabled={state.disabled || loadingType === plan.checkoutType}
                >
                  {loadingType === plan.checkoutType
                    ? 'Processing...'
                    : state.label ?? plan.cta}
                </Button>

                {state.note && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    {state.note}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center space-y-4">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-3">Why Choose Our Platform?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-medium mb-1">Targeted Learning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Courses designed specifically for Chinese typing skills
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-medium mb-1">Track Progress</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed analytics to monitor your improvement
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔊</span>
              </div>
              <h4 className="font-medium mb-1">Audio Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Native pronunciation for every word and phrase
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>All plans include a 7-day money-back guarantee.</p>
          <p>Secure payment powered by Creem.</p>
        </div>
      </div>
    </div>
  );
}
