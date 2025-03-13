import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    
    if (!userId) {
      console.log('No user ID in headers');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Attempting to find user with ID:', userId);

    // Clean and validate the userId
    const cleanUserId = userId.toString().trim();
    if (!mongoose.Types.ObjectId.isValid(cleanUserId)) {
      console.log('Invalid ObjectId format:', cleanUserId);
      return NextResponse.json(
        { message: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Verify user exists in database
    const user = await User.findById(cleanUserId).select('-password');
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User found:', { id: user._id.toString(), email: user.email, name: user.name });
    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Error getting user' },
      { status: 500 }
    );
  }
} 