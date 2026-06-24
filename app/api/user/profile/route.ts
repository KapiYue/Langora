import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOrUpdateUserProfile } from '@/lib/db/queries';

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const rawName = typeof body.fullName === 'string' ? body.fullName.trim() : '';

    if (rawName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be 100 characters or fewer' },
        { status: 400 }
      );
    }

    const fullName = rawName.length > 0 ? rawName : undefined;

    // 同步更新数据库与 Supabase user_metadata，避免下次以旧 metadata 覆盖
    const profile = await createOrUpdateUserProfile(
      user.id,
      user.email || '',
      fullName
    );

    await supabase.auth.updateUser({ data: { full_name: fullName ?? null } });

    return NextResponse.json({
      success: true,
      profile: { fullName: profile.fullName },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
