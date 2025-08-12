-- Additional helper functions for the BB Membership waitlist system

-- Function to increment referral count safely
CREATE OR REPLACE FUNCTION increment_referral_count(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE users 
    SET 
        referral_count = referral_count + 1,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's waitlist position and total count
CREATE OR REPLACE FUNCTION get_waitlist_info(user_email TEXT)
RETURNS TABLE(
    waitlist_position INTEGER,
    total_users INTEGER,
    percentile NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.waitlist_position,
        (SELECT COUNT(*)::INTEGER FROM users) as total_users,
        ROUND(
            (u.waitlist_position::NUMERIC / (SELECT COUNT(*) FROM users)::NUMERIC) * 100, 
            1
        ) as percentile
    FROM users u
    WHERE u.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to move user up in waitlist for referrals
CREATE OR REPLACE FUNCTION apply_referral_bonus(referred_user_id UUID, referrer_code TEXT)
RETURNS void AS $$
DECLARE
    referrer_id UUID;
BEGIN
    -- Find the referrer
    SELECT id INTO referrer_id 
    FROM users 
    WHERE referral_code = referrer_code;
    
    IF referrer_id IS NULL THEN
        RAISE EXCEPTION 'Invalid referral code: %', referrer_code;
    END IF;
    
    -- Update the referred user
    UPDATE users 
    SET 
        referred_by = referrer_code,
        updated_at = NOW()
    WHERE id = referred_user_id;
    
    -- Create referral record
    INSERT INTO referrals (referrer_id, referee_id, referral_code)
    VALUES (referrer_id, referred_user_id, referrer_code);
    
    -- Increment referrer's count
    UPDATE users 
    SET 
        referral_count = referral_count + 1,
        updated_at = NOW()
    WHERE id = referrer_id;
    
    -- Trigger position recalculation (handled by our trigger)
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get leaderboard data
CREATE OR REPLACE FUNCTION get_referral_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    rank INTEGER,
    first_name TEXT,
    referral_count INTEGER,
    waitlist_position INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY u.referral_count DESC)::INTEGER as rank,
        u.first_name::TEXT,
        u.referral_count,
        u.waitlist_position
    FROM users u
    WHERE u.referral_count > 0
    ORDER BY u.referral_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user stats for dashboard
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_id UUID)
RETURNS TABLE(
    waitlist_position INTEGER,
    total_users INTEGER,
    referral_count INTEGER,
    friends_joined INTEGER,
    spots_to_move INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            u.waitlist_position,
            u.referral_count,
            (SELECT COUNT(*)::INTEGER FROM users) as total_users,
            (SELECT COUNT(*)::INTEGER FROM referrals WHERE referrer_id = user_id) as friends_joined
        FROM users u
        WHERE u.id = user_id
    )
    SELECT 
        us.waitlist_position,
        us.total_users,
        us.referral_count,
        us.friends_joined,
        -- Calculate how many more referrals needed to move up 10 spots
        GREATEST(0, 2 - (us.referral_count % 2))::INTEGER as spots_to_move
    FROM user_stats us;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate email uniqueness before insert
CREATE OR REPLACE FUNCTION check_email_unique(email_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (SELECT 1 FROM users WHERE email = email_to_check);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get neighborhoods list (for form dropdown)
CREATE OR REPLACE FUNCTION get_miami_neighborhoods()
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY[
        'Brickell',
        'Downtown Miami',
        'South Beach',
        'Mid Beach',
        'North Beach',
        'Wynwood',
        'Design District',
        'Little Havana',
        'Coral Gables',
        'Coconut Grove',
        'Key Biscayne',
        'Aventura',
        'Sunny Isles',
        'Doral',
        'Kendall',
        'Homestead',
        'Other'
    ];
END;
$$ LANGUAGE plpgsql;

-- Function to get interest categories (for form checkboxes)
CREATE OR REPLACE FUNCTION get_interest_categories()
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY[
        'Social Events & Fitness',
        'Networking & Mentorship',
        'Business & Finance Talks',
        'Member Perks & Discounts',
        'Wellness & Self-Care',
        'Career Development',
        'Creative Workshops',
        'Food & Wine Events'
    ];
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_referral_count TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_waitlist_info TO authenticated, anon;
GRANT EXECUTE ON FUNCTION apply_referral_bonus TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_referral_leaderboard TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_dashboard_stats TO authenticated, anon;
GRANT EXECUTE ON FUNCTION check_email_unique TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_miami_neighborhoods TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_interest_categories TO authenticated, anon;