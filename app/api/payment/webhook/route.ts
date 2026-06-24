import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import {
  createOrUpdateSubscription,
  createCoursePurchase,
  createPaymentTransaction,
  getLessonById,
  findSubscriptionByCreemId,
  cancelUserSubscription,
  expireUserSubscription,
  updatePaymentTransaction,
  getActiveProSubscription,
} from '@/lib/db/queries';
import {
  getPaymentTypeByProductId,
  cancelCreemSubscription,
  PaymentType,
} from '@/lib/creem';

// 验证 Creem webhook 签名
function verifyCreemSignature(payload: string, signature: string, secret: string): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

// Creem 的关联对象可能是字符串 id，也可能是完整对象，这里统一取出 id
function extractId(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
    return (value as { id?: string }).id;
  }
  return undefined;
}

function toDate(value: unknown): Date | undefined {
  if (!value || typeof value !== 'string') return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

// Creem webhook 对象的最小类型定义（仅声明本文件使用到的字段）
interface CreemMetadata {
  userId?: string;
  paymentType?: PaymentType;
  lessonId?: string;
}

interface CreemOrder {
  id?: string;
  amount?: number;
  currency?: string;
  transaction?: string;
}

interface CreemTransaction {
  amount_paid?: number;
  amount?: number;
  currency?: string;
}

interface CreemProduct {
  price?: number;
  currency?: string;
}

interface CreemSubscription {
  id: string;
  customer?: unknown;
  current_period_start_date?: string;
  current_period_end_date?: string;
  last_transaction_id?: string;
  last_transaction?: CreemTransaction;
  product?: CreemProduct;
}

interface CreemCheckout {
  id: string;
  order?: CreemOrder;
  product?: unknown;
  customer?: unknown;
  subscription?: CreemSubscription;
  metadata?: CreemMetadata;
}

interface CreemRefund {
  transaction?: unknown;
  subscription?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('creem-signature');

    if (!signature) {
      console.error('Missing Creem signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.CREEM_WEBHOOK_SECRET;
    if (!secret) {
      console.error('CREEM_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // 验证 webhook 签名
    const isValid = verifyCreemSignature(payload, signature, secret);
    if (!isValid) {
      console.error('Invalid Creem signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(payload);
    console.log('Received Creem webhook:', event.eventType, event.id);

    switch (event.eventType) {
      case 'checkout.completed':
        await handleCheckoutCompleted(event.object);
        break;

      case 'subscription.active':
      case 'subscription.paid':
        await handleSubscriptionPaid(event.object);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(event.object);
        break;

      case 'subscription.expired':
        await handleSubscriptionExpired(event.object);
        break;

      case 'refund.created':
        await handleRefundCreated(event.object);
        break;

      default:
        console.log('Unhandled event type:', event.eventType);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(checkout: CreemCheckout) {
  const { order, product, customer, subscription, metadata } = checkout;

  const userId = metadata?.userId;
  if (!userId) {
    console.error('Missing userId in checkout metadata');
    return;
  }

  const productId = extractId(product);
  // 优先使用 metadata.paymentType，缺失时根据 product id 反查
  const paymentType: PaymentType | null =
    (metadata?.paymentType as PaymentType) || getPaymentTypeByProductId(productId);

  if (!paymentType) {
    console.error('Unable to determine payment type for checkout', checkout?.id);
    return;
  }

  const customerId = extractId(customer);
  const subscriptionId = extractId(subscription);
  const amount = order?.amount ?? 0;
  const currency = order?.currency ?? 'USD';

  // 解析单节课程对应的数据库 lesson id
  let lessonDbId: number | undefined;
  if (paymentType === 'single_course' && metadata?.lessonId) {
    const lesson = await getLessonById(metadata.lessonId);
    lessonDbId = lesson?.id;
  }

  // 创建支付交易记录（幂等）
  await createPaymentTransaction({
    userId,
    creemTransactionId: order?.transaction || order?.id || checkout.id,
    creemOrderId: order?.id,
    creemSubscriptionId: subscriptionId,
    creemCustomerId: customerId || '',
    type: paymentType,
    status: 'paid',
    amount,
    currency,
    lessonId: lessonDbId,
    metadata: checkout,
  });

  if (paymentType === 'single_course') {
    if (!lessonDbId) {
      console.error('Lesson not found for single course purchase:', metadata?.lessonId);
      return;
    }

    await createCoursePurchase({
      userId,
      lessonId: lessonDbId,
      creemOrderId: order?.id || checkout.id,
      creemCustomerId: customerId || '',
      status: 'paid',
      amount,
      currency,
    });

    console.log('Single course purchase completed:', { userId, lessonId: lessonDbId });
  } else if (paymentType === 'subscription') {
    await createOrUpdateSubscription({
      userId,
      subscriptionType: 'pro',
      creemSubscriptionId: subscriptionId,
      creemCustomerId: customerId || '',
      status: 'active',
      currentPeriodStart: toDate(subscription?.current_period_start_date),
      currentPeriodEnd: toDate(subscription?.current_period_end_date),
    });

    console.log('Subscription created:', { userId, subscriptionId });
  } else if (paymentType === 'lifetime') {
    await createOrUpdateSubscription({
      userId,
      subscriptionType: 'lifetime',
      creemCustomerId: customerId || '',
      status: 'active',
    });

    // 升级到终身会员后，自动停止仍在计费的 Pro 月度订阅，避免重复扣费
    const activePro = await getActiveProSubscription(userId);
    if (activePro?.creemSubscriptionId) {
      const canceled = await cancelCreemSubscription(activePro.creemSubscriptionId);
      if (canceled) {
        await cancelUserSubscription(userId, 'pro');
        console.log('Auto-canceled Pro subscription after lifetime upgrade:', {
          userId,
          subscriptionId: activePro.creemSubscriptionId,
        });
      } else {
        // 取消失败时不更新本地状态，等待人工或后续重试处理，避免出现"本地已取消但仍在 Creem 扣费"
        console.error('Failed to auto-cancel Pro subscription after lifetime upgrade:', {
          userId,
          subscriptionId: activePro.creemSubscriptionId,
        });
      }
    }

    console.log('Lifetime membership created:', { userId });
  }
}

async function handleSubscriptionPaid(subscription: CreemSubscription) {
  const existingSubscription = await findSubscriptionByCreemId(subscription.id);

  if (!existingSubscription) {
    // 可能 checkout.completed 还没处理完，这里跳过，等待重试或 checkout 事件
    console.log('No local subscription found yet for:', subscription.id);
    return;
  }

  const customerId = extractId(subscription.customer) || existingSubscription.creemCustomerId;

  await createOrUpdateSubscription({
    userId: existingSubscription.userId,
    subscriptionType: 'pro',
    creemSubscriptionId: subscription.id,
    creemCustomerId: customerId,
    status: 'active',
    currentPeriodStart: toDate(subscription.current_period_start_date),
    currentPeriodEnd: toDate(subscription.current_period_end_date),
  });

  // 记录续订交易（幂等：相同 transaction id 不会重复插入）
  if (subscription.last_transaction_id) {
    const lastTx = subscription.last_transaction;
    await createPaymentTransaction({
      userId: existingSubscription.userId,
      creemTransactionId: subscription.last_transaction_id,
      creemSubscriptionId: subscription.id,
      creemCustomerId: customerId,
      type: 'subscription',
      status: 'paid',
      amount: lastTx?.amount_paid ?? lastTx?.amount ?? subscription.product?.price ?? 0,
      currency: lastTx?.currency ?? subscription.product?.currency ?? 'USD',
      metadata: subscription,
    });
  }

  console.log('Subscription payment processed:', { subscriptionId: subscription.id });
}

async function handleSubscriptionCanceled(subscription: CreemSubscription) {
  const existingSubscription = await findSubscriptionByCreemId(subscription.id);

  if (existingSubscription) {
    // 到期停服：保留 current_period_end_date，用户在周期结束前仍可访问
    await cancelUserSubscription(
      existingSubscription.userId,
      'pro',
      toDate(subscription.current_period_end_date)
    );
    console.log('Subscription canceled (access kept until period end):', {
      subscriptionId: subscription.id,
    });
  }
}

async function handleSubscriptionExpired(subscription: CreemSubscription) {
  const existingSubscription = await findSubscriptionByCreemId(subscription.id);

  if (existingSubscription) {
    const customerId =
      extractId(subscription.customer) || existingSubscription.creemCustomerId;
    await createOrUpdateSubscription({
      userId: existingSubscription.userId,
      subscriptionType: 'pro',
      creemSubscriptionId: subscription.id,
      creemCustomerId: customerId,
      status: 'expired',
    });

    console.log('Subscription expired:', { subscriptionId: subscription.id });
  }
}

async function handleRefundCreated(refund: CreemRefund) {
  const transactionId = extractId(refund?.transaction);
  if (transactionId) {
    await updatePaymentTransaction(transactionId, { status: 'refunded' });
  }

  // 如果退款关联订阅，则立即移除访问权限（退款不享受到期停服宽限期）
  const subscriptionId = extractId(refund?.subscription);
  if (subscriptionId) {
    const existingSubscription = await findSubscriptionByCreemId(subscriptionId);
    if (existingSubscription) {
      await expireUserSubscription(existingSubscription.userId, 'pro');
    }
  }

  console.log('Refund processed:', { transactionId, subscriptionId });
}
