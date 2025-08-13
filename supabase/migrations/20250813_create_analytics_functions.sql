-- Create function to get signups grouped by date
CREATE OR REPLACE FUNCTION get_signups_by_date(
  start_date timestamp with time zone DEFAULT '2020-01-01'::timestamp,
  include_all boolean DEFAULT false
)
RETURNS TABLE(date text, count bigint)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at)::text as date,
    COUNT(*)::bigint as count
  FROM users 
  WHERE (include_all = true OR created_at >= start_date)
  GROUP BY DATE(created_at)
  ORDER BY DATE(created_at) ASC;
END;
$$;

-- Create indexes for better analytics performance
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_neighborhood ON users(neighborhood);
CREATE INDEX IF NOT EXISTS idx_users_age_range ON users(age_range);
CREATE INDEX IF NOT EXISTS idx_users_referral_count ON users(referral_count);
CREATE INDEX IF NOT EXISTS idx_users_payment_completed ON users(payment_completed);