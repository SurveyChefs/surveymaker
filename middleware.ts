import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

// Add paths that should be protected by authentication
const protectedPaths = [
  '/surveybuilder',
  '/api/survey'
];

// Add paths that should be accessible only to non-authenticated users
const authPaths = [
  '/login',
  '/register'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware running for path:', pathname);

  // Check if the path should be protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // Get token from cookies
  const token = request.cookies.get('auth-token');
  console.log('Auth token present:', !!token);

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  try {
    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token.value, secret);
      const user = payload as unknown as JWTPayload;
      console.log('JWT payload:', {
        userId: user.userId,
        email: user.email,
        name: user.name
      });
      
      // Add the user data to request headers
      requestHeaders.set('x-user-id', user.userId);
      requestHeaders.set('x-user-email', user.email);
      requestHeaders.set('x-user-name', user.name);

      // If user is authenticated and tries to access auth pages, redirect to home
      if (isAuthPath) {
        console.log('Authenticated user trying to access auth page, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else {
      // If no token and trying to access protected path, redirect to login
      if (isProtectedPath) {
        console.log('Unauthenticated user trying to access protected path, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  } catch (error) {
    console.error('Token verification error:', error);
    // If token verification fails and trying to access protected path, redirect to login
    if (isProtectedPath) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Create a new response with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [
    '/',
    '/api/survey/:path*',
    '/api/auth/me',
    '/surveybuilder',
    '/login',
    '/register'
  ],
}; 