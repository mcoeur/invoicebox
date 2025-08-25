import { NextRequest, NextResponse } from 'next/server';
import { UserProfileService } from '@/lib/services/userProfileService';
import { UpdateUserProfileRequest } from '@/types';

export async function GET() {
  try {
    const profile = await UserProfileService.getUserProfile();
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data: UpdateUserProfileRequest = await request.json();
    
    const profile = await UserProfileService.updateUserProfile(data);
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}