-- Email logs table for tracking email delivery
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL CHECK (email_type IN ('welcome', 'referral_success', 'payment_confirmed', 'position_update')),
  email_address VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')) DEFAULT 'sent',
  resend_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);

-- Analytics events table for tracking user behavior
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  event_name VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);

-- Admin audit log table
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  changes JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  performed_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for admin logs
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_target_user_id ON admin_logs(target_user_id);
CREATE INDEX idx_admin_logs_performed_at ON admin_logs(performed_at);