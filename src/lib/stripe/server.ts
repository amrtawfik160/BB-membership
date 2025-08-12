import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-01.acacia',
  typescript: true,
});

// Helper function to create or retrieve a Stripe customer
export async function getOrCreateStripeCustomer(
  email: string,
  name: string,
  existingCustomerId?: string | null
): Promise<string> {
  // If customer already exists, return their ID
  if (existingCustomerId) {
    try {
      // Verify the customer still exists in Stripe
      await stripe.customers.retrieve(existingCustomerId);
      return existingCustomerId;
    } catch (error) {
      // Customer doesn't exist in Stripe, create a new one
      console.warn(`Customer ${existingCustomerId} not found in Stripe, creating new one`);
    }
  }

  // Create a new customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'bb_membership_waitlist',
    },
  });

  return customer.id;
}

// Helper function to create a setup intent
export async function createSetupIntent(customerId: string): Promise<string> {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    usage: 'off_session',
    metadata: {
      source: 'bb_membership_waitlist',
    },
  });

  return setupIntent.client_secret!;
}