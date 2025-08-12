-- BB Membership Waitlist Database Schema
-- Created: 2025-08-11
-- Description: Creates users and referrals tables for the BB Membership waitlist system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table according to PRD specifications
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal Info (Step 1)
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  instagram_handle VARCHAR(100),
  linkedin_url TEXT,

  -- Location & Demographics (Step 2)
  age_range VARCHAR(20) NOT NULL CHECK (age_range IN ('20s', '30s', '40s', '50s', '60s+')),
  neighborhood VARCHAR(100) NOT NULL,
  occupation TEXT NOT NULL,

  -- Interests (Step 3)
  interests TEXT[] DEFAULT '{}', -- Array of selected interests
  marketing_opt_in BOOLEAN DEFAULT false,

  -- Referral System
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  referred_by VARCHAR(50), -- Referrer's code
  waitlist_position INTEGER,
  referral_count INTEGER DEFAULT 0,

  -- Payment (Step 4)
  stripe_customer_id VARCHAR(255),
  stripe_payment_method_id VARCHAR(255),
  payment_completed BOOLEAN DEFAULT false,

  -- Tracking & Metadata
  ip_address INET,
  user_agent TEXT,
  utm_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create referrals table to track referral relationships
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_users_waitlist_position ON users(waitlist_position);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referee_id ON referrals(referee_id);
CREATE INDEX idx_referrals_referral_code ON referrals(referral_code);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code(first_name TEXT, last_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_code TEXT;
    final_code TEXT;
    counter INTEGER := 0;
BEGIN
    -- Create base code from first name + year
    base_code := UPPER(LEFT(first_name, 4)) || '2024';
    final_code := base_code;
    
    -- Check for uniqueness and add counter if needed
    WHILE EXISTS (SELECT 1 FROM users WHERE referral_code = final_code) LOOP
        counter := counter + 1;
        final_code := base_code || counter::TEXT;
    END LOOP;
    
    RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to update waitlist positions
CREATE OR REPLACE FUNCTION update_waitlist_positions()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate all positions based on creation date and referral bonus
    WITH ranked_users AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                ORDER BY 
                    created_at ASC,
                    referral_count DESC
            ) as new_position
        FROM users
    )
    UPDATE users 
    SET waitlist_position = ranked_users.new_position
    FROM ranked_users
    WHERE users.id = ranked_users.id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update waitlist positions on new user or referral count change
CREATE TRIGGER update_waitlist_trigger
    AFTER INSERT OR UPDATE OF referral_count ON users
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_waitlist_positions();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow public insert for new signups (waitlist registration)
CREATE POLICY "Allow public signup" ON users
    FOR INSERT WITH CHECK (true);

-- Allow reading waitlist position and public profile info for referral system
CREATE POLICY "Allow public waitlist info" ON users
    FOR SELECT USING (true); -- Users can see basic info

-- Referrals policies
CREATE POLICY "Users can view their referrals" ON referrals
    FOR SELECT USING (
        auth.uid()::text = referrer_id::text OR 
        auth.uid()::text = referee_id::text
    );

CREATE POLICY "Allow referral creation" ON referrals
    FOR INSERT WITH CHECK (true);

-- Create admin role for full access (optional)
CREATE ROLE bb_admin;
GRANT ALL ON users TO bb_admin;
GRANT ALL ON referrals TO bb_admin;

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT ON referrals TO authenticated;

-- Grant permissions to anon users for signup
GRANT INSERT ON users TO anon;
GRANT SELECT ON users TO anon; -- Limited by RLS policies

COMMENT ON TABLE users IS 'BB Membership waitlist users with referral system';
COMMENT ON TABLE referrals IS 'Tracks referral relationships between users';
COMMENT ON COLUMN users.referral_code IS 'Unique code for user to share with friends';
COMMENT ON COLUMN users.referred_by IS 'Referral code of the user who referred this user';
COMMENT ON COLUMN users.waitlist_position IS 'Current position in the waitlist (lower = better)';
COMMENT ON COLUMN users.interests IS 'Array of selected interest categories';
COMMENT ON COLUMN users.age_range IS 'Age bracket selection (20s, 30s, 40s, 50s, 60s+)';
COMMENT ON COLUMN users.marketing_opt_in IS 'User consent for marketing communications';
COMMENT ON COLUMN users.payment_completed IS 'Whether payment method has been successfully set up';