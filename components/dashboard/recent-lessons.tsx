"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

interface RecentLessonsProps {
  lessons: Array<{
    id: number;
    completedItems: number;
    totalItems: number;
    isCompleted: boolean;
    lastAccessedAt: Date | null;
    accuracy: number | null;
    lesson: {
      id: number;
      lessonId: string;
      titleEn: string;
      titleZh: string | null;
      descriptionEn: string;
      cover: string | null;
      tag: string;
      order: number;
    };
  }>;
}

export function RecentLessons({ lessons }: RecentLessonsProps) {
  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getProgress = (completedItems: number, totalItems: number) => {
    return Math.round((completedItems / totalItems) * 100);
  };

  const getStatus = (isCompleted: boolean, completedItems: number) => {
    if (isCompleted) return "completed";
    if (completedItems > 0) return "in_progress";
    return "not_started";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Lessons</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/courses">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="mb-4">No lessons started yet</p>
              <Button asChild>
                <Link href="/dashboard/courses">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Your First Lesson
                </Link>
              </Button>
            </div>
          ) : (
            lessons.map((lessonProgress) => {
              const lesson = lessonProgress.lesson;
              const progress = getProgress(lessonProgress.completedItems, lessonProgress.totalItems);
              const status = getStatus(lessonProgress.isCompleted, lessonProgress.completedItems);
              
              return (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {status === 'completed' ? (
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      ) : status === 'in_progress' ? (
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{lesson.titleEn}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lesson.descriptionEn.length > 50 
                          ? `${lesson.descriptionEn.slice(0, 50)}...` 
                          : lesson.descriptionEn}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {lesson.tag}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(lessonProgress.lastAccessedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{progress}%</div>
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            progress === 100 ? 'bg-green-500' : 
                            progress > 0 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <Button asChild size="sm" variant={status === 'not_started' ? 'default' : 'outline'}>
                      <Link href={`/lesson/${lesson.lessonId}`}>
                        {status === 'completed' ? 'Review' : 
                         status === 'in_progress' ? 'Continue' : 'Start'}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
} 