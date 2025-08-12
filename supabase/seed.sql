-- Sample data for testing BB Membership waitlist system
-- This file can be run to populate the database with test data

-- Insert sample users
INSERT INTO users (
    first_name, last_name, email, date_of_birth, instagram_handle, linkedin_url,
    age_range, neighborhood, occupation, interests, marketing_opt_in,
    referral_code, referred_by, stripe_customer_id, payment_completed,
    ip_address, user_agent, utm_source
) VALUES 
-- Seed users (no referrers)
(
    'Sarah', 'Johnson', 'sarah.johnson@email.com', '1992-05-15', '@sarahj_miami', 'https://linkedin.com/in/sarah-johnson',
    '30s', 'Brickell', 'Marketing Director at Tech Startup',
    ARRAY['Networking & Mentorship', 'Business & Finance Talks'],
    true, 'SARA2024', NULL, 'cus_test_sarah123', true,
    '192.168.1.10', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'instagram'
),
(
    'Emma', 'Rodriguez', 'emma.rodriguez@email.com', '1988-09-22', '@emma_r_miami', NULL,
    '30s', 'Coral Gables', 'Investment Banker',
    ARRAY['Business & Finance Talks', 'Member Perks & Discounts'],
    true, 'EMMA2024', NULL, 'cus_test_emma456', true,
    '192.168.1.11', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'google'
),
(
    'Isabella', 'Chen', 'isabella.chen@email.com', '1995-03-08', '@bella_miami', 'https://linkedin.com/in/isabella-chen',
    '20s', 'South Beach', 'Fashion Designer',
    ARRAY['Social Events & Fitness', 'Creative Workshops'],
    true, 'ISAB2024', NULL, 'cus_test_isabella789', true,
    '192.168.1.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'facebook'
),
-- Referred users (testing referral system)
(
    'Maria', 'Garcia', 'maria.garcia@email.com', '1990-12-03', '@maria_g_', NULL,
    '30s', 'Wynwood', 'Real Estate Agent',
    ARRAY['Networking & Mentorship', 'Social Events & Fitness'],
    false, 'MARI2024', 'SARA2024', NULL, false,
    '192.168.1.13', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'referral'
),
(
    'Ana', 'Martinez', 'ana.martinez@email.com', '1993-07-19', '@ana_martinez_', 'https://linkedin.com/in/ana-martinez',
    '20s', 'Design District', 'Graphic Designer',
    ARRAY['Creative Workshops', 'Social Events & Fitness'],
    true, 'ANAS2024', 'SARA2024', NULL, false,
    '192.168.1.14', 'Mozilla/5.0 (Android 11; Mobile)', 'referral'
),
(
    'Victoria', 'Lopez', 'victoria.lopez@email.com', '1987-11-30', '@vic_lopez', NULL,
    '30s', 'Key Biscayne', 'Lawyer',
    ARRAY['Business & Finance Talks', 'Wellness & Self-Care'],
    true, 'VICT2024', 'EMMA2024', 'cus_test_victoria321', true,
    '192.168.1.15', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)', 'referral'
),
-- More users for variety
(
    'Sophia', 'Williams', 'sophia.williams@email.com', '1991-04-14', '@sophiaw_', 'https://linkedin.com/in/sophia-williams',
    '30s', 'Coconut Grove', 'Product Manager',
    ARRAY['Career Development', 'Networking & Mentorship'],
    true, 'SOPH2024', 'ISAB2024', NULL, false,
    '192.168.1.16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'referral'
),
(
    'Camila', 'Torres', 'camila.torres@email.com', '1994-01-27', '@cami_torres', NULL,
    '20s', 'Aventura', 'Social Media Manager',
    ARRAY['Social Events & Fitness', 'Food & Wine Events'],
    false, 'CAMI2024', NULL, NULL, false,
    '192.168.1.17', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'organic'
),
(
    'Daniela', 'Ruiz', 'daniela.ruiz@email.com', '1989-08-11', '@dani_ruiz_', 'https://linkedin.com/in/daniela-ruiz',
    '30s', 'Doral', 'Financial Advisor',
    ARRAY['Business & Finance Talks', 'Wellness & Self-Care', 'Member Perks & Discounts'],
    true, 'DANI2024', 'EMMA2024', 'cus_test_daniela654', true,
    '192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'referral'
),
(
    'Andrea', 'Morales', 'andrea.morales@email.com', '1996-06-05', '@andy_morales', NULL,
    '20s', 'Little Havana', 'Nurse Practitioner',
    ARRAY['Wellness & Self-Care', 'Career Development'],
    true, 'ANDR2024', 'SARA2024', NULL, false,
    '192.168.1.19', 'Mozilla/5.0 (Android 12; Mobile)', 'referral'
);

-- Update referral counts based on the inserted data
-- This would normally be handled by triggers, but for seed data we'll do it manually
UPDATE users SET referral_count = (
    SELECT COUNT(*) FROM users u2 WHERE u2.referred_by = users.referral_code
);

-- Manually create referral relationships (normally done by triggers)
INSERT INTO referrals (referrer_id, referee_id, referral_code)
SELECT 
    referrer.id, 
    referee.id, 
    referee.referred_by
FROM users referee
JOIN users referrer ON referee.referred_by = referrer.referral_code
WHERE referee.referred_by IS NOT NULL;

-- Test the waitlist position function
SELECT update_waitlist_positions();

-- Verify our test data
SELECT 
    first_name || ' ' || last_name as name,
    email,
    referral_code,
    referred_by,
    referral_count,
    waitlist_position,
    payment_completed
FROM users 
ORDER BY waitlist_position;

-- Test our helper functions
SELECT * FROM get_waitlist_info('sarah.johnson@email.com');
SELECT * FROM get_referral_leaderboard(5);
SELECT * FROM get_user_dashboard_stats((SELECT id FROM users WHERE email = 'sarah.johnson@email.com'));