"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Calendar } from "lucide-react";
import Link from "next/link";

interface DashboardWelcomeProps {
  user: User;
}

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
  const getName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user.email?.split('@')[0] || 'Student';
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-orange-500 text-white border-none">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, {getName()}! 👋
            </h1>
            <p className="text-blue-100 mb-6 text-lg">
              Ready to continue your Chinese typing journey?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Link href="/dashboard/courses">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Continue Learning
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Calendar className="w-5 h-5 mr-2" />
                View Progress
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-6xl opacity-20">
              学习
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 