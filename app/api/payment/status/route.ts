import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CREEM_API_URL, getCreemApiKey } from '@/lib/creem';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkout_id');

    if (!checkoutId) {
      return NextResponse.json({ error: 'Missing checkout_id' }, { status: 400 });
    }

    // 调用Creem API查询checkout状态
    const response = await fetch(`${CREEM_API_URL}/v1/checkouts?checkout_id=${checkoutId}`, {
      headers: {
        'x-api-key': getCreemApiKey(),
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch checkout status from Creem');
      return NextResponse.json({ error: 'Failed to fetch payment status' }, { status: 500 });
    }

    const checkout = await response.json();

    return NextResponse.json({
      success: true,
      status: checkout.status,
      order: checkout.order,
      metadata: checkout.metadata,
    });

  } catch (error) {
    console.error('Payment status API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 