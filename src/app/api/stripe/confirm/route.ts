import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase';
import { stripe } from '@/lib/stripe/server';

// Validation schema for the request
const confirmPaymentSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  setupIntentId: z.string().min(1, 'Setup intent ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { userId, setupIntentId } = confirmPaymentSchema.parse(body);

    // Initialize Supabase client
    const supabase = createClient();

    // Fetch user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Retrieve the setup intent from Stripe to get payment method details
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

    if (setupIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment method setup was not completed successfully' },
        { status: 400 }
      );
    }

    if (!setupIntent.payment_method) {
      return NextResponse.json(
        { error: 'No payment method found for this setup intent' },
        { status: 400 }
      );
    }

    // Update user record with payment method information
    const { error: updateError } = await supabase
      .from('users')
      .update({
        stripe_payment_method_id: setupIntent.payment_method as string,
        payment_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Failed to update user with payment method:', updateError);
      return NextResponse.json(
        { error: 'Failed to save payment information' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        paymentMethodId: setupIntent.payment_method,
        setupIntentStatus: setupIntent.status,
      },
      message: 'Payment method saved successfully',
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

    // Handle Stripe errors
    if (error instanceof Error && error.message.includes('Stripe')) {
      console.error('Stripe error:', error);
      return NextResponse.json(
        { error: 'Payment service error. Please try again later.' },
        { status: 503 }
      );
    }

    // Handle other errors
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}