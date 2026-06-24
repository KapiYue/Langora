import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateUserLessonProgress, updateUserProfileStats } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, lessonId, completedItems, totalItems, accuracy, timeSpent } = body;

    console.log('API: Received progress data:', {
      userId,
      lessonId,
      completedItems,
      totalItems,
      accuracy,
      timeSpent,
      isCompleted: completedItems >= totalItems
    });

    // Verify user owns this progress
    if (userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update lesson progress
    const progress = await updateUserLessonProgress(
      userId,
      lessonId,
      completedItems,
      totalItems,
      accuracy,
      timeSpent
    );

    // Update user profile stats
    await updateUserProfileStats(userId);

    return NextResponse.json({ 
      success: true, 
      progress: {
        ...progress,
        percentage: Math.round((completedItems / totalItems) * 100)
      }
    });
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' }, 
      { status: 500 }
    );
  }
} 