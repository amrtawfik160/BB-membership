import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  validateAdminCredentials, 
  createAdminToken, 
  setAdminSessionCookie,
  clearAdminSession,
  checkRateLimit,
  recordLoginAttempt 
} from '@/lib/admin-auth';

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      recordLoginAttempt(ip, false);
      
      const remainingTime = rateLimit.resetTime ? 
        Math.ceil((rateLimit.resetTime - Date.now()) / 1000 / 60) : 15;
      
      return NextResponse.json(
        { 
          error: `Too many login attempts. Try again in ${remainingTime} minutes.`,
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Validate credentials
    const isValid = validateAdminCredentials(email, password);
    
    if (!isValid) {
      recordLoginAttempt(ip, false);
      
      return NextResponse.json(
        { 
          error: 'Invalid email or password',
          remaining: rateLimit.remaining 
        },
        { status: 401 }
      );
    }

    // Create session token
    const token = createAdminToken(email);
    
    // Set session cookie
    await setAdminSessionCookie(token);
    
    // Record successful login
    recordLoginAttempt(ip, true);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email,
        isAdmin: true,
      },
    });

  } catch (error) {
    console.error('Admin login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  try {
    await clearAdminSession();
    
    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
    
  } catch (error) {
    console.error('Admin logout error:', error);
    
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

// Check authentication status
export async function GET(request: NextRequest) {
  try {
    const { getAdminSession } = await import('@/lib/admin-auth');
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.email,
        isAdmin: session.isAdmin,
      },
    });

  } catch (error) {
    console.error('Admin auth check error:', error);
    
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}