import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase';
import { getOrCreateStripeCustomer, createSetupIntent } from '@/lib/stripe/server';

// Validation schema for the request
const setupIntentSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { userId } = setupIntentSchema.parse(body);

    // Initialize Supabase client
    const supabase = createClient();

    // Fetch user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create or retrieve Stripe customer
    const fullName = `${user.first_name} ${user.last_name}`;
    const stripeCustomerId = await getOrCreateStripeCustomer(
      user.email,
      fullName,
      user.stripe_customer_id
    );

    // Update user record with Stripe customer ID if it's new
    if (!user.stripe_customer_id || user.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          stripe_customer_id: stripeCustomerId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Failed to update user with Stripe customer ID:', updateError);
        // Continue anyway - the setup intent can still be created
      }
    }

    // Create a setup intent for this customer
    const clientSecret = await createSetupIntent(stripeCustomerId);

    // Return the client secret to the frontend
    return NextResponse.json({
      success: true,
      data: {
        clientSecret,
        customerId: stripeCustomerId,
      },
      message: 'Setup intent created successfully',
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
    console.error('Setup intent error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}