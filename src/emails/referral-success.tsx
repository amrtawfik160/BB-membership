import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface ReferralSuccessEmailProps {
  firstName: string;
  referredFriendName: string;
  newPosition: number;
  oldPosition: number;
  referralCode: string;
  referralUrl: string;
}

export const ReferralSuccessEmail = ({
  firstName = 'Sarah',
  referredFriendName = 'Emma',
  newPosition = 237,
  oldPosition = 247,
  referralCode = 'SARAH2024',
  referralUrl = 'https://bbmembership.com?ref=SARAH2024',
}: ReferralSuccessEmailProps) => {
  const positionsGained = oldPosition - newPosition;
  
  return (
    <Html>
      <Head />
      <Preview>
        Great news! {referredFriendName} joined using your referral code.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logo}>BB</Text>
          </Section>
          
          <Heading style={h1}>🎉 Your referral worked!</Heading>
          
          <Text style={text}>
            Hi {firstName},
          </Text>
          
          <Text style={text}>
            Exciting news! <strong>{referredFriendName}</strong> just joined the BB Membership waitlist using your referral code.
          </Text>

          <Section style={successBox}>
            <Text style={successEmoji}>🚀</Text>
            <Text style={successText}>You moved up {positionsGained} spots!</Text>
            <Text style={positionUpdate}>
              From #{oldPosition} → #{newPosition}
            </Text>
          </Section>

          <Text style={text}>
            Keep sharing to climb even higher! Every friend who joins helps you get closer to the front of the line.
          </Text>

          <Section style={referralBox}>
            <Text style={referralLabel}>Your Referral Code</Text>
            <Text style={referralCodeText}>{referralCode}</Text>
            <Button
              style={button}
              href={referralUrl}
            >
              Keep Sharing
            </Button>
          </Section>

          <Text style={text}>
            <strong>Pro tip:</strong> Share on Instagram stories, text your group chats, or post in your professional networks. The more you share, the faster you&apos;ll get early access!
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Thanks for helping us build an amazing community of ambitious women. We can&apos;t wait to see you at our first events!
          </Text>

          <Text style={signature}>
            Cheering you on,<br />
            The BB Team 💕
          </Text>

          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              © 2024 BB Membership. Building your best life, one connection at a time.
            </Text>
            <Link href="#" style={footerLink}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles (reuse from welcome email with some additions)
const main = {
  backgroundColor: '#fefefe',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoSection = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const logo = {
  color: '#ff6b9d',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 auto',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 24px',
};

const successBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '12px',
  margin: '32px 24px',
  padding: '24px',
  textAlign: 'center' as const,
  border: '1px solid #bbf7d0',
};

const successEmoji = {
  fontSize: '48px',
  margin: '0 0 16px 0',
};

const successText = {
  color: '#059669',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const positionUpdate = {
  color: '#047857',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '8px 0 0 0',
  fontFamily: 'monospace',
};

const referralBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  margin: '32px 24px',
  padding: '24px',
  textAlign: 'center' as const,
  border: '1px solid #e5e7eb',
};

const referralLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const referralCodeText = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  margin: '0 0 16px 0',
  letterSpacing: '2px',
};

const button = {
  backgroundColor: '#ff6b9d',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  margin: '16px 0',
  padding: '12px 20px',
};

const signature = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0',
  padding: '0 24px',
  fontStyle: 'italic',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 24px',
};

const footer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 8px 0',
};

const footerLink = {
  color: '#6b7280',
  fontSize: '12px',
  textDecoration: 'underline',
};

export default ReferralSuccessEmail;