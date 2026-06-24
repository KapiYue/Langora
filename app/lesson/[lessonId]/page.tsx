import { LessonPlayer } from "@/components/lesson/lesson-player";
import { AccessDeniedCard } from "@/components/lesson/access-denied-card";
import { notFound } from "next/navigation";
import { getLessonWithItems, canUserAccessLesson } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";

interface LessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }
  
  // Find the lesson data from database
  const lesson = await getLessonWithItems(lessonId);
  
  if (!lesson) {
    notFound();
  }

  // 检查用户是否可以访问该课程
  const accessCheck = await canUserAccessLesson(user.id, lessonId);
  
  if (!accessCheck.canAccess) {
    return <AccessDeniedCard lessonId={lessonId} />;
  }

  return <LessonPlayer lesson={lesson} userId={user.id} />;
} 