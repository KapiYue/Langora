"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Clock, Flame } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalLessonsCompleted: number;
    totalWordsLearned: number;
    currentStreak: number;
    totalTimeSpent: number;
    averageAccuracy: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const statsConfig = [
    {
      title: "Lessons Completed",
      value: stats.totalLessonsCompleted.toString(),
      change: "+3 this week",
      icon: Trophy,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Words Mastered",
      value: stats.totalWordsLearned.toString(),
      change: "+24 this week",
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Practice Time",
      value: formatTime(stats.totalTimeSpent),
      change: "This week",
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Daily Streak",
      value: stats.currentStreak.toString(),
      change: "Days in a row",
      icon: Flame,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 