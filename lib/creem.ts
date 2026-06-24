// Creem 支付相关的共享配置与工具

export type PaymentType = 'single_course' | 'subscription' | 'lifetime';

// 唯一的免费课程
export const FREE_LESSON_ID = 'greetings_l1';

// Creem 基础配置（通过环境变量切换 测试/生产 环境）
export const CREEM_API_URL =
  process.env.NEXT_PUBLIC_CREEM_URL || 'https://test-api.creem.io';

export function getCreemApiKey(): string {
  const key = process.env.CREEM_API_KEY;
  if (!key) {
    throw new Error('CREEM_API_KEY environment variable is not set');
  }
  return key;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

// 不同支付类型对应的 Creem Product ID（来自环境变量）
export const PRODUCT_IDS: Record<PaymentType, string | undefined> = {
  single_course: process.env.CREEM_SINGLE_COURSE_PRODUCT_ID,
  subscription: process.env.CREEM_SUBSCRIPTION_PRODUCT_ID,
  lifetime: process.env.CREEM_LIFETIME_PRODUCT_ID,
};

export function getProductId(type: PaymentType): string {
  const productId = PRODUCT_IDS[type];
  if (!productId) {
    throw new Error(`Product ID for payment type "${type}" is not configured`);
  }
  return productId;
}

// 根据 Creem 返回的 product id 反查支付类型（webhook 兜底用）
export function getPaymentTypeByProductId(
  productId: string | undefined | null
): PaymentType | null {
  if (!productId) return null;
  for (const [type, id] of Object.entries(PRODUCT_IDS)) {
    if (id && id === productId) {
      return type as PaymentType;
    }
  }
  return null;
}

// 取消 Creem 订阅（用于升级到终身会员后停止月度扣费）
export async function cancelCreemSubscription(
  subscriptionId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${CREEM_API_URL}/v1/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': getCreemApiKey(),
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Failed to cancel Creem subscription:', subscriptionId, text);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error canceling Creem subscription:', subscriptionId, e);
    return false;
  }
}
