import { CourseStore } from "@/components/courses/course-store";
import { 
  getAllLessons, 
  getAllUserLessonProgress, 
  getUserActiveSubscription 
} from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { userCoursePurchases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 获取所有课程、用户进度、订阅状态和购买记录
  const [lessons, userProgress, userSubscription, userPurchases] = await Promise.all([
    getAllLessons(),
    getAllUserLessonProgress(user.id),
    getUserActiveSubscription(user.id),
    db.select({ lessonId: userCoursePurchases.lessonId })
      .from(userCoursePurchases)
      .where(eq(userCoursePurchases.userId, user.id))
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Course Store</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from our comprehensive collection of Chinese typing lessons.
        </p>
      </div>
      
      <CourseStore 
        lessons={lessons} 
        userProgress={userProgress} 
        userSubscription={userSubscription}
        userPurchases={userPurchases}
      />
    </div>
  );
} 