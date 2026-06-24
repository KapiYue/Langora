import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentLessons } from "@/components/dashboard/recent-lessons";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { getUserStats, getUserRecentLessons, createOrUpdateUserProfile } from "@/lib/db/queries";

export default async function DashboardPage() {
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
    user.email || '', 
    user.user_metadata?.full_name
  );

  // 获取用户统计数据
  const userStats = await getUserStats(user.id);
  
  // 获取用户最近的课程
  const recentLessons = await getUserRecentLessons(user.id, 3);

  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />
      <DashboardStats stats={userStats} />
      <RecentLessons lessons={recentLessons} />
    </div>
  );
} 