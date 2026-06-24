// 会员套餐的统一定义，供首页定价区与 dashboard 会员页共用，避免多处重复维护
import { Zap, Crown, type LucideIcon } from "lucide-react";

export type PlanType = "subscription" | "lifetime";

export type PlanId = "free" | "subscription" | "lifetime";

export interface MembershipPlan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  // null 表示无需付款（免费套餐），其余对应 checkout 接口的 type
  checkoutType: PlanType | null;
  popular: boolean;
  badge?: string;
  icon: LucideIcon;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "free",
    name: "Free Trial",
    price: "$0",
    period: "Always Free",
    description: "Perfect for getting started",
    features: [
      "Basic Greetings lesson",
      "Basic typing practice",
      "Progress tracking",
      "Community access",
    ],
    cta: "Start Free",
    checkoutType: null,
    popular: false,
    icon: Zap,
  },
  {
    id: "subscription",
    name: "Monthly Pro",
    price: "$10",
    period: "per month",
    description: "Full access to all features",
    features: [
      "All lessons unlocked",
      "Advanced practice modes",
      "Detailed analytics",
      "Priority support",
      "Download certificates",
      "Custom practice sets",
    ],
    cta: "Start Pro",
    checkoutType: "subscription",
    popular: true,
    icon: Crown,
  },
  {
    id: "lifetime",
    name: "Lifetime Access",
    price: "$99",
    period: "one-time payment",
    description: "Best value for serious learners",
    features: [
      "Everything in Pro",
      "Lifetime access",
      "Future course updates",
      "Premium support",
      "Early access to new features",
      "Exclusive community",
    ],
    cta: "Get Lifetime",
    checkoutType: "lifetime",
    popular: false,
    badge: "BEST VALUE",
    icon: Crown,
  },
];

// 仅需付费的套餐（dashboard 会员页使用）
export const PAID_MEMBERSHIP_PLANS = MEMBERSHIP_PLANS.filter(
  (plan): plan is MembershipPlan & { checkoutType: PlanType } =>
    plan.checkoutType !== null
);
