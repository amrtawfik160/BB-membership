import { Resend } from 'resend';
import { render } from '@react-email/render';
import { createClient } from '@/lib/supabase';
import WelcomeEmail from '@/emails/welcome-email';
import ReferralSuccessEmail from '@/emails/referral-success';

// Initialize Resend with fallback for build time
const resend = new Resend(process.env.RESEND_API_KEY || 'fallback-key-for-build');
const fromEmail = process.env.FROM_EMAIL || 'BB Membership <hello@bbmembership.com>';

// Email types
export enum EmailType {
  WELCOME = 'welcome',
  REFERRAL_SUCCESS = 'referral_success',
  PAYMENT_CONFIRMED = 'payment_confirmed',
  POSITION_UPDATE = 'position_update',
}

// Base email sending function
export async function sendEmail({
  to,
  subject,
  htmlContent,
  textContent,
  emailType,
  userId,
}: {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  emailType: EmailType;
  userId?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    // Log email in database
    if (userId) {
      await logEmail({
        userId,
        emailType,
        emailAddress: to,
        subject,
        status: 'sent',
        resendId: data?.id || null,
      });
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Log failed email
    if (userId) {
      await logEmail({
        userId,
        emailType,
        emailAddress: to,
        subject,
        status: 'failed',
        resendId: null,
      });
    }
    
    throw error;
  }
}

// Log email in database
async function logEmail({
  userId,
  emailType,
  emailAddress,
  subject,
  status,
  resendId,
}: {
  userId: string;
  emailType: EmailType;
  emailAddress: string;
  subject: string;
  status: 'sent' | 'failed';
  resendId: string | null;
}) {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('email_logs')
      .insert({
        user_id: userId,
        email_type: emailType,
        email_address: emailAddress,
        subject,
        status,
        resend_id: resendId,
      });

    if (error) {
      console.error('Failed to log email:', error);
    }
  } catch (error) {
    console.error('Email logging error:', error);
  }
}

// Welcome email
export async function sendWelcomeEmail({
  userId,
  firstName,
  email,
  waitlistPosition,
  referralCode,
}: {
  userId: string;
  firstName: string;
  email: string;
  waitlistPosition: number;
  referralCode: string;
}) {
  const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bbmembership.com'}?ref=${referralCode}`;
  
  const htmlContent = await render(WelcomeEmail({
    firstName,
    waitlistPosition,
    referralCode,
    referralUrl,
  }));

  const textContent = `
Hi ${firstName},

Welcome to the BB Membership waitlist! You're #${waitlistPosition} on the list.

Your referral code: ${referralCode}
Share your link: ${referralUrl}

For every friend who joins using your code, you'll move up in the queue.

Questions? Just reply to this email.

With love,
The BB Team 💕
`;

  return sendEmail({
    to: email,
    subject: `Welcome to BB Membership! You're #${waitlistPosition} 🌟`,
    htmlContent,
    textContent,
    emailType: EmailType.WELCOME,
    userId,
  });
}

// Referral success email
export async function sendReferralSuccessEmail({
  userId,
  firstName,
  email,
  referredFriendName,
  newPosition,
  oldPosition,
  referralCode,
}: {
  userId: string;
  firstName: string;
  email: string;
  referredFriendName: string;
  newPosition: number;
  oldPosition: number;
  referralCode: string;
}) {
  const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bbmembership.com'}?ref=${referralCode}`;
  const positionsGained = oldPosition - newPosition;
  
  const htmlContent = await render(ReferralSuccessEmail({
    firstName,
    referredFriendName,
    newPosition,
    oldPosition,
    referralCode,
    referralUrl,
  }));

  const textContent = `
Hi ${firstName},

Great news! ${referredFriendName} just joined using your referral code.

You moved up ${positionsGained} spots! From #${oldPosition} → #${newPosition}

Keep sharing: ${referralUrl}

Thanks for helping us build an amazing community!

The BB Team 💕
`;

  return sendEmail({
    to: email,
    subject: `🎉 Your referral worked! You moved up ${positionsGained} spots`,
    htmlContent,
    textContent,
    emailType: EmailType.REFERRAL_SUCCESS,
    userId,
  });
}

// Get email logs for a user
export async function getUserEmailLogs(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('email_logs')
    .select('*')
    .eq('user_id', userId)
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Failed to get email logs:', error);
    return [];
  }

  return data || [];
}

// Get email statistics
export async function getEmailStats() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('email_logs')
    .select('email_type, status')
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Failed to get email stats:', error);
    return null;
  }

  const stats = data?.reduce((acc, log) => {
    const type = log.email_type;
    const status = log.status;
    
    if (!acc[type]) {
      acc[type] = { sent: 0, failed: 0, total: 0 };
    }
    
    if (status === 'sent' || status === 'failed') {
      acc[type][status as 'sent' | 'failed']++;
    }
    acc[type].total++;
    
    return acc;
  }, {} as Record<string, { sent: number; failed: number; total: number }>);

  return stats || {};
}