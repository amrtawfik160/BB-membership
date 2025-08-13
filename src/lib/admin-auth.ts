import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Types
export interface AdminUser {
  email: string;
  isAdmin: true;
  loginTime: number;
}

export interface AdminSession {
  user: AdminUser;
  expiresAt: number;
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bbmembership.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms
const COOKIE_NAME = 'admin-session';

// Hash password for comparison (in production, this would be pre-hashed)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

/**
 * Validates admin credentials
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  if (email !== ADMIN_EMAIL) {
    return false;
  }
  
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
}

/**
 * Creates a JWT token for admin session
 */
export function createAdminToken(email: string): string {
  const payload: AdminUser = {
    email,
    isAdmin: true,
    loginTime: Date.now(),
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    algorithm: 'HS256',
  });
}

/**
 * Verifies and decodes admin JWT token
 */
export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    
    // Check if token is still valid (not older than session duration)
    const tokenAge = Date.now() - decoded.loginTime;
    if (tokenAge > SESSION_DURATION) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Sets admin session cookie
 */
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });
}

/**
 * Gets admin session from cookie
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    
    if (!token) {
      return null;
    }
    
    return verifyAdminToken(token);
  } catch (error) {
    console.error('Error getting admin session:', error);
    return null;
  }
}

/**
 * Clears admin session cookie
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Middleware function to check admin authentication
 */
export function requireAdminAuth(request: NextRequest): AdminUser | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyAdminToken(token);
}

/**
 * Higher-order function for protecting API routes
 */
export function withAdminAuth(
  handler: (admin: AdminUser, request: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const admin = requireAdminAuth(request);
    
    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(admin, request);
  };
}

/**
 * Log admin action for audit trail
 */
export async function logAdminAction({
  action,
  targetUserId,
  changes,
  request,
}: {
  action: string;
  targetUserId?: string;
  changes?: Record<string, any>;
  request: NextRequest;
}) {
  try {
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // In a real app, you'd save this to your database
    // For now, just log it
    const logEntry = {
      action,
      target_user_id: targetUserId || null,
      changes: changes || {},
      ip_address: ip,
      user_agent: userAgent,
      performed_at: new Date().toISOString(),
    };
    
    console.log('Admin action logged:', logEntry);
    
    // TODO: Save to admin_logs table in database
    /*
    const supabase = createClient();
    await supabase.from('admin_logs').insert(logEntry);
    */
    
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

/**
 * Rate limiting for admin login attempts
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime?: number } {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  
  if (!attempts) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  
  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  
  if (attempts.count >= MAX_ATTEMPTS) {
    return { 
      allowed: false, 
      remaining: 0,
      resetTime: attempts.lastAttempt + LOCKOUT_DURATION
    };
  }
  
  return { 
    allowed: true, 
    remaining: MAX_ATTEMPTS - attempts.count - 1 
  };
}

export function recordLoginAttempt(ip: string, success: boolean) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  
  if (success) {
    // Clear attempts on successful login
    loginAttempts.delete(ip);
  } else {
    // Increment failed attempts
    loginAttempts.set(ip, {
      count: attempts.count + 1,
      lastAttempt: now,
    });
  }
}