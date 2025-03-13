import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env');
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();
    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Convert ObjectId to string before creating token
    const userIdString = user._id.toString();
    console.log('User authenticated:', { id: userIdString, email: user.email });

    // Create JWT token with string userId
    const token = await new SignJWT({ 
      userId: userIdString,
      email: user.email.toLowerCase(),
      name: user.name
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    console.log('Generated token payload:', {
      userId: userIdString,
      email: user.email.toLowerCase(),
      name: user.name
    });

    const response = NextResponse.json({
      id: userIdString,
      email: user.email,
      name: user.name
    });

    // Set cookie with appropriate options
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Error during login' },
      { status: 500 }
    );
  }
} 