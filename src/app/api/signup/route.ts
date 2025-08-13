import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase';
import { getOrCreateStripeCustomer, createSetupIntent } from '@/lib/stripe/server';

// Validation schema for the signup form data from steps 1-4
const signupSchema = z.object({
  // Personal Information (Step 1)
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  date_of_birth: z.string().refine((date) => {
    const parsed = new Date(date);
    const now = new Date();
    const age = (now.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }, 'Must be at least 18 years old'),
  instagram_handle: z.string().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable().or(z.literal('')),

  // Location & Background (Step 2)
  age_range: z.enum(['20s', '30s', '40s', '50s', '60s+']),
  neighborhood: z.string().min(1, 'Neighborhood is required'),
  occupation: z.string().min(1, 'Occupation is required'),

  // Interests (Step 3)
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  marketing_opt_in: z.boolean().default(false),

  // Payment & Referral (Step 4)
  referral_code: z.string().optional().nullable(),
  payment_method_id: z.string().optional().nullable(),

  // Tracking data
  user_agent: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
});

type SignupData = z.infer<typeof signupSchema>;

// Generate unique referral code
function generateReferralCode(firstName: string): string {
  const nameBase = firstName.toUpperCase().slice(0, 10); // Limit to 10 chars
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 random digits
  return `${nameBase}${randomDigits}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate the data
    const validatedData = signupSchema.parse(body);
    
    // Initialize Supabase client
    const supabase = createClient();
    
    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', validatedData.email)
      .single();
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    // Generate unique referral code
    let referralCode: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      referralCode = generateReferralCode(validatedData.first_name);
      
      // Check if this referral code already exists
      const { data: existingCode } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referralCode)
        .single();
      
      isUnique = !existingCode;
      attempts++;
      
      if (attempts >= maxAttempts) {
        // Add timestamp to ensure uniqueness
        referralCode = `${referralCode}_${Date.now()}`;
        isUnique = true;
      }
    } while (!isUnique && attempts < maxAttempts);
    
    // Calculate initial waitlist position
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    const waitlistPosition = (totalUsers || 0) + 1;
    
    // Handle referral if provided
    let referrerId: string | null = null;
    if (validatedData.referral_code) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id, referral_count')
        .eq('referral_code', validatedData.referral_code)
        .single();
      
      if (referrer) {
        referrerId = referrer.id;
        
        // Increment referrer's referral count
        await supabase
          .from('users')
          .update({ 
            referral_count: (referrer.referral_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', referrer.id);
      }
      // If referral code is invalid, we just ignore it (don't fail the signup)
    }
    
    // Get request metadata
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = validatedData.user_agent || request.headers.get('user-agent') || 'unknown';
    
    // Use UTM source from form data or URL params
    const url = new URL(request.url);
    const utmSource = validatedData.utm_source || url.searchParams.get('utm_source');
    
    // Create the new user record
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        email: validatedData.email,
        date_of_birth: validatedData.date_of_birth,
        instagram_handle: validatedData.instagram_handle || null,
        linkedin_url: validatedData.linkedin_url || null,
        age_range: validatedData.age_range,
        neighborhood: validatedData.neighborhood,
        occupation: validatedData.occupation,
        interests: validatedData.interests,
        marketing_opt_in: validatedData.marketing_opt_in,
        referral_code: referralCode,
        referred_by: validatedData.referral_code || null,
        waitlist_position: waitlistPosition,
        referral_count: 0,
        ip_address: ip,
        user_agent: userAgent,
        utm_source: utmSource,
        payment_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create or retrieve Stripe customer and setup intent for payment
    let clientSecret: string | null = null;
    let stripeCustomerId: string | null = null;
    
    try {
      // Create Stripe customer
      const fullName = `${validatedData.first_name} ${validatedData.last_name}`;
      stripeCustomerId = await getOrCreateStripeCustomer(
        validatedData.email,
        fullName,
        null // New user, no existing customer ID
      );

      // Update user record with Stripe customer ID
      await supabase
        .from('users')
        .update({
          stripe_customer_id: stripeCustomerId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', newUser.id);

      // Create setup intent for payment method collection
      clientSecret = await createSetupIntent(stripeCustomerId);
      
    } catch (stripeError) {
      console.error('Stripe setup error:', stripeError);
      // Don't fail the signup if Stripe fails - payment can be completed later
      // But log the error for monitoring
    }
    
    // Create referral record if applicable
    if (referrerId && newUser) {
      await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerId,
          referee_id: newUser.id,
          referral_code: validatedData.referral_code,
          created_at: new Date().toISOString(),
        });
    }
    
    // Send welcome email (don't fail signup if email fails)
    try {
      if (process.env.RESEND_API_KEY) {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            userId: newUser.id,
            firstName: newUser.first_name,
            email: newUser.email,
            waitlistPosition: newUser.waitlist_position,
            referralCode: newUser.referral_code,
          }),
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the signup
      console.error('Failed to send welcome email:', emailError);
    }

    // Return success response with user data
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          referralCode: newUser.referral_code,
          waitlistPosition: newUser.waitlist_position,
        },
        clientSecret,
        stripeCustomerId,
      },
      message: 'Account created successfully'
    }, { status: 201 });
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: formattedErrors 
        },
        { status: 400 }
      );
    }
    
    // Handle other errors
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}