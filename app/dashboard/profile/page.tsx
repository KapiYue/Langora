import { createClient } from "@/lib/supabase/server";
import {
  createOrUpdateUserProfile,
  getUserProfile,
  getUserStats,
  getUserActiveSubscription,
  getUserRecentLessons,
} from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentLessons } from "@/components/dashboard/recent-lessons";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 确保用户配置文件存在
  await createOrUpdateUserProfile(
    user.id,
    user.email || "",
    user.user_metadata?.full_name
  );

  const [profile, stats, subscription, recentLessons] = await Promise.all([
    getUserProfile(user.id),
    getUserStats(user.id),
    getUserActiveSubscription(user.id),
    getUserRecentLessons(user.id, 3),
  ]);

  const displayName = profile?.fullName || "";
  const email = user.email || "";
  const initial = (displayName || email).charAt(0).toUpperCase();

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and review your learning progress.
        </p>
      </div>

      {/* Identity card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-20 w-20 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 flex items-center justify-center text-white text-2xl font-semibold">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold truncate">
                {displayName || "Learner"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 truncate">
                {email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {subscription?.subscriptionType === "lifetime" ? (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <Crown className="h-3.5 w-3.5" />
                    Lifetime
                  </span>
                ) : subscription?.subscriptionType === "pro" ? (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <Crown className="h-3.5 w-3.5" />
                    Pro
                  </span>
                ) : (
                  <Badge variant="outline">Free</Badge>
                )}
                <span className="text-xs text-gray-500">
                  Member since {formatDate(profile?.createdAt ?? null)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit personal info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm initialFullName={displayName} />
        </CardContent>
      </Card>

      {/* Learning stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Learning Stats</h2>
        <DashboardStats stats={stats} />
      </div>

      {/* Recent lessons */}
      <RecentLessons lessons={recentLessons} />
    </div>
  );
}
