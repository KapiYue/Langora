"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, CheckCircle, Star, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Define types based on the database schema
type Lesson = {
  id: number;
  lessonId: string;
  titleEn: string;
  titleZh: string | null;
  descriptionEn: string;
  cover: string | null;
  tag: string;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type UserProgress = {
  id: number;
  lessonId: number;
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
};

interface CourseStoreProps {
  lessons: Lesson[];
  userProgress: UserProgress[];
  userSubscription?: { subscriptionType: string; status: string } | null;
  userPurchases?: { lessonId: number }[];
}

const tagColors = {
  "Greeting": "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  "Conversation": "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  "Food": "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  "Travel": "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  "Business": "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export function CourseStore({ lessons, userProgress, userSubscription, userPurchases }: CourseStoreProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = lessons.map(lesson => lesson.tag);
    return Array.from(new Set(tags));
  }, [lessons]);

  // Filter lessons based on selected tags
  const filteredLessons = useMemo(() => {
    if (selectedTags.length === 0) {
      return lessons;
    }
    return lessons.filter(lesson => selectedTags.includes(lesson.tag));
  }, [lessons, selectedTags]);

  // Create progress lookup map
  const progressMap = useMemo(() => {
    const map = new Map<number, UserProgress>();
    userProgress.forEach(progress => {
      map.set(progress.lessonId, progress);
    });
    return map;
  }, [userProgress]);

  // Create purchases lookup set
  const purchasedLessons = useMemo(() => {
    const set = new Set<number>();
    userPurchases?.forEach(purchase => {
      set.add(purchase.lessonId);
    });
    return set;
  }, [userPurchases]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      {/* Filter Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "transition-all",
                  selectedTags.includes(tag) && "bg-orange-500 hover:bg-orange-600"
                )}
              >
                {tag}
              </Button>
            ))}
            {selectedTags.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
          {selectedTags.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Showing {filteredLessons.length} course{filteredLessons.length !== 1 ? 's' : ''} 
              for: {selectedTags.join(', ')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <CourseCard 
            key={lesson.id} 
            lesson={lesson} 
            progress={progressMap.get(lesson.id)}
            userSubscription={userSubscription}
            hasPurchased={purchasedLessons.has(lesson.id)}
          />
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No courses found for the selected categories.
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Show All Courses
          </Button>
        </div>
      )}
    </div>
  );
}

function CourseCard({ 
  lesson, 
  progress,
  userSubscription,
  hasPurchased
}: { 
  lesson: Lesson; 
  progress?: UserProgress;
  userSubscription?: { subscriptionType: string; status: string } | null;
  hasPurchased?: boolean;
}) {
  // Use real progress data if available
  const progressPercentage = progress 
    ? Math.round((progress.completedItems / progress.totalItems) * 100)
    : 0;
  
  const isCompleted = progress?.isCompleted || false;
  const isStarted = (progress?.completedItems || 0) > 0;
  
  // Get word count from lesson items (we'll need to add this to the query)
  const wordCount = progress?.totalItems || 10; // Fallback estimate

  // Check if user can access this lesson
  const isFree = lesson.lessonId === 'greetings_l1';
  const hasActiveSubscription = userSubscription?.status === 'active';
  const canAccess = isFree || hasActiveSubscription || hasPurchased;

  const handlePurchaseCourse = async () => {
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'single_course', lessonId: lesson.lessonId }),
      });
      
      const data = await response.json();
      if (data.success) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const getTagColor = (tag: string) => {
    return tagColors[tag as keyof typeof tagColors] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Cover Image */}
      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        {lesson.cover ? (
          <img 
            src={lesson.cover} 
            alt={lesson.titleEn}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to gradient background if image fails to load
              const target = e.target as HTMLElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.className = "aspect-video bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 relative overflow-hidden flex items-center justify-center";
                const fallback = document.createElement('div');
                fallback.className = "text-4xl opacity-30";
                fallback.textContent = lesson.tag === 'Greeting' ? '👋' : 
                                     lesson.tag === 'Conversation' ? '💬' : 
                                     lesson.tag === 'Food' ? '🍜' : '📚';
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 flex items-center justify-center">
            <div className="text-4xl opacity-30">
              {lesson.tag === 'Greeting' ? '👋' : 
               lesson.tag === 'Conversation' ? '💬' : 
               lesson.tag === 'Food' ? '🍜' : '📚'}
            </div>
          </div>
        )}
        {/* Progress indicator */}
        {isStarted && (
          <div className="absolute top-3 right-3">
            {isCompleted ? (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {progressPercentage}%
              </div>
            )}
          </div>
        )}
        {/* Free/Pro badge */}
        <div className="absolute top-3 left-3">
          {isFree ? (
            <Badge className="bg-green-500 hover:bg-green-600 text-white">
              FREE
            </Badge>
          ) : (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
              PRO
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Category */}
          <Badge className={getTagColor(lesson.tag)} variant="secondary">
            {lesson.tag}
          </Badge>

          {/* Title */}
          <div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {lesson.titleEn}
            </h3>
            {lesson.titleZh && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.titleZh}</p>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {lesson.descriptionEn.length > 45 
              ? `${lesson.descriptionEn.slice(0, 45)}...` 
              : lesson.descriptionEn}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {wordCount} words
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              4.8
            </div>
          </div>

          {/* Progress Bar */}
          {isStarted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          {canAccess ? (
            <Button asChild className="w-full">
              <Link href={`/lesson/${lesson.lessonId}`}>
                <PlayCircle className="w-4 h-4 mr-2" />
                {isCompleted ? 'Review' : isStarted ? 'Continue' : 'Start Lesson'}
              </Link>
            </Button>
          ) : (
            <div className="space-y-2">
              <Button onClick={handlePurchaseCourse} className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Buy Course
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/dashboard/membership">
                  <Crown className="w-4 h-4 mr-2" />
                  Get Pro Access
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 