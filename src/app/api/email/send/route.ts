import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendWelcomeEmail, sendReferralSuccessEmail, EmailType } from '@/lib/email';

// Validation schemas
const welcomeEmailSchema = z.object({
  type: z.literal('welcome'),
  userId: z.string().uuid(),
  firstName: z.string(),
  email: z.string().email(),
  waitlistPosition: z.number().positive(),
  referralCode: z.string(),
});

const referralSuccessEmailSchema = z.object({
  type: z.literal('referral_success'),
  userId: z.string().uuid(),
  firstName: z.string(),
  email: z.string().email(),
  referredFriendName: z.string(),
  newPosition: z.number().positive(),
  oldPosition: z.number().positive(),
  referralCode: z.string(),
});

const emailRequestSchema = z.discriminatedUnion('type', [
  welcomeEmailSchema,
  referralSuccessEmailSchema,
]);

export async function POST(request: NextRequest) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const validatedData = emailRequestSchema.parse(body);

    let result;

    switch (validatedData.type) {
      case 'welcome':
        result = await sendWelcomeEmail({
          userId: validatedData.userId,
          firstName: validatedData.firstName,
          email: validatedData.email,
          waitlistPosition: validatedData.waitlistPosition,
          referralCode: validatedData.referralCode,
        });
        break;

      case 'referral_success':
        result = await sendReferralSuccessEmail({
          userId: validatedData.userId,
          firstName: validatedData.firstName,
          email: validatedData.email,
          referredFriendName: validatedData.referredFriendName,
          newPosition: validatedData.newPosition,
          oldPosition: validatedData.oldPosition,
          referralCode: validatedData.referralCode,
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.id,
    });

  } catch (error) {
    // Handle validation errors
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

    // Handle email service errors
    console.error('Email API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve email logs (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidSchema = z.string().uuid();
    const validatedUserId = uuidSchema.parse(userId);

    // Get email logs (this would be imported from email service)
    const { getUserEmailLogs } = await import('@/lib/email');
    const logs = await getUserEmailLogs(validatedUserId);

    return NextResponse.json({
      success: true,
      data: logs,
    });

  } catch (error) {
    console.error('Get email logs error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid userId format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to retrieve email logs' },
      { status: 500 }
    );
  }
}