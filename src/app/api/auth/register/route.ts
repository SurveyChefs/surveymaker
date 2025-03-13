import { NextResponse } from 'next/server';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password, name } = await req.json();
    console.log('Registration attempt for email:', email);

    // Validate input
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log('Existing user check:', !!existingUser);
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name
    });

    console.log('User created successfully:', { id: user._id, email: user.email });

    // Remove password from response
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    // Add more detailed error information
    const errorMessage = error.code === 11000 
      ? 'Email already exists in database'
      : 'Error creating user';
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
} 