import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { getLessonById, getUserAccessStatus } from '@/lib/db/queries';
import {
  CREEM_API_URL,
  FREE_LESSON_ID,
  PaymentType,
  getCreemApiKey,
  getProductId,
  getSiteUrl,
} from '@/lib/creem';

interface CheckoutRequest {
  type: PaymentType;
  lessonId?: string; // 仅 single_course 需要
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CheckoutRequest = await request.json();
    const { type, lessonId } = body;

    // 验证请求参数
    if (!type || !['single_course', 'subscription', 'lifetime'].includes(type)) {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    if (type === 'single_course' && !lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required for single course purchase' },
        { status: 400 }
      );
    }

    // 防止重复购买：根据用户当前会员状态拦截无意义/冲突的下单
    const access = await getUserAccessStatus(user.id);

    // 终身会员已拥有全部权益，禁止任何再次购买
    if (access.isLifetime) {
      return NextResponse.json(
        { error: 'You already have lifetime access to all courses.' },
        { status: 409 }
      );
    }

    // 已有 Pro 订阅时，禁止重复订阅；但允许升级到终身会员
    // （webhook 在终身会员支付成功后会自动取消该 Pro 订阅）
    if (type === 'subscription' && access.isPro) {
      return NextResponse.json(
        { error: 'You already have an active Pro subscription.' },
        { status: 409 }
      );
    }

    // 拥有不限量访问（Pro/终身）时，单节课程购买无意义
    if (type === 'single_course' && access.hasUnlimitedAccess) {
      return NextResponse.json(
        { error: 'Your current plan already includes access to all courses.' },
        { status: 409 }
      );
    }

    // 单节课程：校验课程是否存在 & 是否为免费课程
    if (type === 'single_course') {
      if (lessonId === FREE_LESSON_ID) {
        return NextResponse.json(
          { error: 'This lesson is free, no purchase required' },
          { status: 400 }
        );
      }
      const lesson = await getLessonById(lessonId!);
      if (!lesson) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
      }
      if (access.purchasedLessonIds.includes(lesson.id)) {
        return NextResponse.json(
          { error: 'You have already purchased this lesson.' },
          { status: 409 }
        );
      }
    }

    let productId: string;
    try {
      productId = getProductId(type);
    } catch (e) {
      console.error('Creem product id config error:', e);
      return NextResponse.json(
        { error: 'Payment product is not configured' },
        { status: 500 }
      );
    }

    // 用于追踪本次支付的请求 ID（会在 return url 和 webhook 中回传）
    const requestId = randomUUID();

    // 准备 checkout 会话数据
    const checkoutData: Record<string, unknown> = {
      product_id: productId,
      request_id: requestId,
      customer: {
        email: user.email || '',
      },
      success_url: `${getSiteUrl()}/payment/success`,
      // metadata 会原样在 webhook 中回传，用于识别用户与购买内容
      metadata: {
        userId: user.id,
        paymentType: type,
        ...(type === 'single_course' && lessonId ? { lessonId } : {}),
      },
    };

    // 单节课程：额外把 lessonId 作为自定义字段上传，方便在 Creem 后台核对
    if (type === 'single_course' && lessonId) {
      checkoutData.custom_field = [
        {
          type: 'text',
          key: 'lessonId',
          label: 'Lesson',
          optional: true,
        },
      ];
    }

    // 调用 Creem API 创建 checkout 会话
    const response = await fetch(`${CREEM_API_URL}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getCreemApiKey(),
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Creem API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    const checkoutSession = await response.json();

    return NextResponse.json({
      success: true,
      checkout_url: checkoutSession.checkout_url,
      checkout_id: checkoutSession.id,
      request_id: requestId,
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
