import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  firstName: string;
  waitlistPosition: number;
  referralCode: string;
  referralUrl: string;
}

export const WelcomeEmail = ({
  firstName = 'Sarah',
  waitlistPosition = 247,
  referralCode = 'SARAH2024',
  referralUrl = 'https://bbmembership.com?ref=SARAH2024',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to BB Membership! You&apos;re #{String(waitlistPosition)} on the waitlist.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logo}>BB</Text>
        </Section>
        
        <Heading style={h1}>You&apos;re on the list! 🌟</Heading>
        
        <Text style={text}>
          Hi {firstName},
        </Text>
        
        <Text style={text}>
          Welcome to the BB Membership waitlist! We&apos;re thrilled to have you join our community of ambitious, socially curious women.
        </Text>

        <Section style={positionBox}>
          <Text style={positionText}>Your Waitlist Position</Text>
          <Text style={positionNumber}>#{waitlistPosition}</Text>
        </Section>

        <Text style={text}>
          <strong>Want to move up the list?</strong> Share your unique referral code with friends to improve your position:
        </Text>

        <Section style={referralBox}>
          <Text style={referralLabel}>Your Referral Code</Text>
          <Text style={referralCodeStyle}>{referralCode}</Text>
          <Button
            style={button}
            href={referralUrl}
          >
            Share Your Link
          </Button>
        </Section>

        <Text style={text}>
          For every friend who joins using your code, you&apos;ll move up in the queue. It&apos;s that simple!
        </Text>

        <Hr style={hr} />

        <Text style={text}>
          <strong>What&apos;s Next?</strong>
        </Text>
        
        <Text style={text}>
          • We&apos;ll keep you updated on your position
          • Follow us on social for exclusive content
          • Start thinking about which events you&apos;d love to attend first!
        </Text>

        <Text style={text}>
          Questions? Just reply to this email - we&apos;d love to hear from you.
        </Text>

        <Text style={signature}>
          With love,<br />
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

// Styles
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

const positionBox = {
  backgroundColor: '#fdf2f8',
  borderRadius: '12px',
  margin: '32px 24px',
  padding: '24px',
  textAlign: 'center' as const,
  border: '1px solid #fce7f3',
};

const positionText = {
  color: '#be185d',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const positionNumber = {
  color: '#be185d',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0',
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

const referralCodeStyle = {
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

export default WelcomeEmail;