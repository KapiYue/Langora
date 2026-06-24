import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getActiveProSubscription, cancelUserSubscription } from '@/lib/db/queries';
import { cancelCreemSubscription } from '@/lib/creem';

// 用户主动取消 Pro 月度订阅（到期停服：停止续费，但保留至当前周期结束）
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await getActiveProSubscription(user.id);
    if (!subscription) {
      return NextResponse.json(
        { error: 'You do not have an active subscription to cancel.' },
        { status: 404 }
      );
    }

    if (!subscription.creemSubscriptionId) {
      return NextResponse.json(
        { error: 'This subscription cannot be canceled.' },
        { status: 400 }
      );
    }

    // 调用 Creem 取消订阅（默认到期停服，停止下一周期扣费）
    const canceled = await cancelCreemSubscription(subscription.creemSubscriptionId);
    if (!canceled) {
      return NextResponse.json(
        { error: 'Failed to cancel subscription. Please try again later.' },
        { status: 502 }
      );
    }

    // 本地标记为已取消并保留 currentPeriodEnd，用户在周期结束前仍可访问
    await cancelUserSubscription(user.id, 'pro');

    return NextResponse.json({
      success: true,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error('Cancel subscription API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
