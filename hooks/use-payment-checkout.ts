"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PlanType } from "@/lib/membership/plans";

// 统一的 checkout 逻辑：处理未登录跳转、401、错误与 loading 状态
export function usePaymentCheckout() {
  const router = useRouter();
  const [loadingType, setLoadingType] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(
    async (type: PlanType) => {
      setLoadingType(type);
      setError(null);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // 未登录用户先去注册/登录
        if (!user) {
          router.push("/auth/sign-up");
          return;
        }

        const response = await fetch("/api/payment/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });

        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }

        const data = await response.json();
        if (data.success && data.checkout_url) {
          window.location.href = data.checkout_url;
          return;
        }

        setError(data.error || "Checkout failed");
        setLoadingType(null);
      } catch (err) {
        console.error("Checkout failed:", err);
        setError("Checkout failed");
        setLoadingType(null);
      }
    },
    [router]
  );

  return { startCheckout, loadingType, error };
}
