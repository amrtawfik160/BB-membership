# BB Membership Database Setup Guide

## Overview
This guide explains how to set up the Supabase database for the BB Membership waitlist system.

## Database Schema

### Tables
1. **users** - Main user table with personal info, waitlist position, referral data, and payment status
2. **referrals** - Junction table tracking referral relationships

### Key Features
- **Referral System**: Users get unique referral codes, waitlist position improves with referrals
- **Waitlist Management**: Automatic position calculation based on signup date and referral count
- **Payment Integration**: Stripe customer and payment method storage
- **Row Level Security**: Data protection with proper access policies
- **Audit Trail**: IP address, user agent, and UTM tracking

## Setup Instructions

### 1. Create a New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run the Database Migrations

#### Option A: Using Supabase Dashboard (Recommended)
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/20250811_create_users_and_referrals.sql`
   - `supabase/migrations/20250811_create_helper_functions.sql`
   - `supabase/seed.sql` (optional - for test data)

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Verify Setup
Run this query in the SQL Editor to verify everything is working:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('users', 'referrals');

-- Check functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';

-- Test data insertion
SELECT * FROM get_miami_neighborhoods();
SELECT * FROM get_interest_categories();
```

## Database Schema Details

### Users Table
```sql
-- Personal Information
first_name VARCHAR(100) NOT NULL
last_name VARCHAR(100) NOT NULL  
email VARCHAR(255) UNIQUE NOT NULL
date_of_birth DATE NOT NULL
instagram_handle VARCHAR(100)
linkedin_url TEXT

-- Demographics  
age_range VARCHAR(20) CHECK (IN '20s', '30s', '40s', '50s', '60s+')
neighborhood VARCHAR(100) NOT NULL
occupation TEXT NOT NULL

-- Preferences
interests TEXT[] -- Array of interest categories
marketing_opt_in BOOLEAN DEFAULT false

-- Referral System
referral_code VARCHAR(50) UNIQUE NOT NULL -- User's unique code
referred_by VARCHAR(50) -- Code of referring user
waitlist_position INTEGER -- Current position (auto-calculated)
referral_count INTEGER DEFAULT 0 -- Number of successful referrals

-- Payment Integration
stripe_customer_id VARCHAR(255)
stripe_payment_method_id VARCHAR(255) 
payment_completed BOOLEAN DEFAULT false

-- Tracking
ip_address INET
user_agent TEXT
utm_source VARCHAR(100)
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### Referrals Table  
```sql
referrer_id UUID REFERENCES users(id)
referee_id UUID REFERENCES users(id)
referral_code VARCHAR(50) -- Code used for referral
created_at TIMESTAMP DEFAULT NOW()
```

## Key Functions

### Core Functions
- `generate_referral_code(first_name, last_name)` - Creates unique referral codes
- `update_waitlist_positions()` - Recalculates all waitlist positions
- `apply_referral_bonus(user_id, referral_code)` - Processes new referrals

### Data Retrieval Functions
- `get_waitlist_info(email)` - Returns position, total users, percentile
- `get_user_dashboard_stats(user_id)` - Complete dashboard statistics
- `get_referral_leaderboard(limit)` - Top referrers ranking
- `get_miami_neighborhoods()` - Dropdown options for neighborhoods
- `get_interest_categories()` - Available interest categories

### Utility Functions
- `check_email_unique(email)` - Validates email before insertion
- `increment_referral_count(user_id)` - Safely updates referral counts

## Row Level Security Policies

### Users Table
- **Public signup**: Anyone can insert new users (waitlist registration)
- **Own data access**: Users can only view/update their own profile
- **Public waitlist info**: Basic position info visible for referral system

### Referrals Table  
- **Own referrals**: Users can only see referrals they made/received
- **Public creation**: Anyone can create referral relationships

## Testing

### Sample Queries
```sql
-- Test waitlist position calculation
SELECT first_name, last_name, waitlist_position, referral_count 
FROM users ORDER BY waitlist_position;

-- Test referral relationships
SELECT 
    r.first_name || ' ' || r.last_name as referrer,
    e.first_name || ' ' || e.last_name as referee,
    ref.created_at
FROM referrals ref
JOIN users r ON ref.referrer_id = r.id  
JOIN users e ON ref.referee_id = e.id;

-- Test dashboard stats
SELECT * FROM get_user_dashboard_stats(
    (SELECT id FROM users WHERE email = 'test@example.com')
);
```

### Performance Tests
- Verify indexes are created: `\d+ users`, `\d+ referrals`
- Test with large datasets: Insert 1000+ users and check query performance
- Monitor trigger performance: Time the waitlist position updates

## Security Considerations
- RLS is enabled on all tables
- Functions use `SECURITY DEFINER` for controlled access
- Sensitive data (passwords) not stored - using Supabase Auth
- Email validation prevents duplicates
- Referral code validation prevents gaming

## Backup & Maintenance
- Regular database backups via Supabase dashboard
- Monitor RLS policies for any access issues
- Track waitlist position calculation performance as user base grows
- Regular cleanup of test data before production