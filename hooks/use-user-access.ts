"use client";

import { useEffect, useState } from "react";

export interface UserAccess {
  isPro: boolean;
  isLifetime: boolean;
  hasUnlimitedAccess: boolean;
  subscriptionType: "pro" | "lifetime" | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

// 读取当前登录用户的会员/购买状态（用于在 UI 上禁用已拥有的套餐）
export function useUserAccess() {
  const [access, setAccess] = useState<UserAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/payment/user-status");
        if (!res.ok) {
          if (active) setAccess(null);
          return;
        }
        const data = await res.json();
        if (active && data.success) {
          setAccess({
            isPro: data.isPro,
            isLifetime: data.isLifetime,
            hasUnlimitedAccess: data.hasUnlimitedAccess,
            subscriptionType: data.subscriptionType,
            subscriptionStatus: data.subscriptionStatus,
            currentPeriodEnd: data.currentPeriodEnd,
            cancelAtPeriodEnd: data.cancelAtPeriodEnd,
          });
        }
      } catch {
        if (active) setAccess(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { access, loading };
}
