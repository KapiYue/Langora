import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserAccessStatus, getUserPaymentHistory } from '@/lib/db/queries';

// 查询当前登录用户的购买/会员情况
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [access, paymentHistory] = await Promise.all([
      getUserAccessStatus(user.id),
      getUserPaymentHistory(user.id),
    ]);

    return NextResponse.json({
      success: true,
      ...access,
      paymentHistory,
    });
  } catch (error) {
    console.error('User status API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
