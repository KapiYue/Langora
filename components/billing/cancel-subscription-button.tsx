"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CancelSubscriptionButtonProps {
  isCanceling: boolean;
  currentPeriodEnd: string | null;
}

function formatDate(date: string | null) {
  if (!date) return "the end of the current period";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function CancelSubscriptionButton({
  isCanceling,
  currentPeriodEnd,
}: CancelSubscriptionButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 已经处于"到期停服"状态：不再展示取消按钮，仅提示访问截止日期
  if (isCanceling) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Cancellation scheduled. You keep access until {formatDate(currentPeriodEnd)}.
      </p>
    );
  }

  const handleCancel = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/cancel-subscription", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to cancel subscription.");
        setLoading(false);
        return;
      }
      setConfirming(false);
      setLoading(false);
      router.refresh();
    } catch {
      setError("Failed to cancel subscription.");
      setLoading(false);
    }
  };

  // 二次确认
  if (confirming) {
    return (
      <div className="mt-2 space-y-2 text-right">
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs ml-auto">
          Cancel your subscription? You&apos;ll keep access until{" "}
          {formatDate(currentPeriodEnd)}, then it won&apos;t renew.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setConfirming(false);
              setError(null);
            }}
            disabled={loading}
          >
            Keep Plan
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? "Canceling..." : "Yes, Cancel"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-2"
      onClick={() => setConfirming(true)}
    >
      Cancel Subscription
    </Button>
  );
}
