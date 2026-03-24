-- =============================================
-- Hopewell Church Management System - Complete SQL Schema
-- Combined from migration files: 001_initial_schema.sql, 002_rls_policies.sql, seed.sql
-- =============================================

-- =============================================
-- PART 1: EXTENSIONS
-- =============================================
-- Enable UUID extension (pgvector removed - not available on Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PART 2: TABLE DEFINITIONS
-- =============================================

-- Members table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  address TEXT,
  county TEXT,
  occupation TEXT,
  profile_image_url TEXT,
  membership_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  baptism_date DATE,
  salvation_date DATE,
  family_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'pastor', 'member', 'treasurer', 'praise-worship', 'ushering')),
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  max_attendees INTEGER,
  registration_required BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  campus_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no-show', 'cancelled')),
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- Sermons table (vector embedding removed - pgvector not available on Supabase)
CREATE TABLE IF NOT EXISTS public.sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  speaker_id UUID NOT NULL REFERENCES public.members(id),
  sermon_series_id UUID,
  sermon_date DATE NOT NULL,
  audio_url TEXT,
  video_url TEXT,
  transcript TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sermon Series table
CREATE TABLE IF NOT EXISTS public.sermon_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  image_url TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Giving Transactions table
CREATE TABLE IF NOT EXISTS public.giving_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.members(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  giving_type TEXT NOT NULL CHECK (giving_type IN ('tithe', 'offering', 'special', 'building_fund', 'missions', 'benevolence')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'stripe', 'cash', 'bank_transfer')),
  reference_number TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  recurring_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  expense_date DATE NOT NULL,
  paid_by UUID REFERENCES public.members(id),
  payment_method TEXT,
  receipt_url TEXT,
  approved_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  group_type TEXT NOT NULL,
  leader_id UUID NOT NULL REFERENCES public.members(id),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, member_id)
);

-- Prayer Requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.members(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'answered', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  composer TEXT,
  lyrics TEXT,
  duration INTEGER,
  key TEXT,
  tempo INTEGER,
  genre TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setlists table
CREATE TABLE IF NOT EXISTS public.setlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setlist Songs table (order matters)
CREATE TABLE IF NOT EXISTS public.setlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setlist_id UUID NOT NULL REFERENCES public.setlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id),
  song_order INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.members(id),
  event_id UUID NOT NULL REFERENCES public.events(id),
  attended BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, event_id)
);

-- Volunteer Shifts table
CREATE TABLE IF NOT EXISTS public.volunteer_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.members(id),
  role TEXT NOT NULL,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- M-Pesa Transactions table
CREATE TABLE IF NOT EXISTS public.mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  merchant_request_id TEXT,
  checkout_request_id TEXT UNIQUE,
  response_code TEXT,
  response_description TEXT,
  result_code TEXT,
  result_description TEXT,
  transaction_date TEXT,
  transaction_id TEXT,
  giving_id UUID REFERENCES public.giving_transactions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  allocated_amount DECIMAL(15, 2) NOT NULL,
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  fiscal_year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pledges table (for pledged giving)
CREATE TABLE IF NOT EXISTS public.pledges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.members(id),
  amount DECIMAL(15, 2) NOT NULL,
  purpose TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitor Management
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  visit_date DATE NOT NULL,
  notes TEXT,
  follow_up_status TEXT DEFAULT 'pending' CHECK (follow_up_status IN ('pending', 'contacted', 'interested', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- OTP Verification Tables
-- =============================================

-- OTP Codes table for email verification
CREATE TABLE IF NOT EXISTS public.verification_otp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  otp_type TEXT NOT NULL DEFAULT 'email_verify' CHECK (otp_type IN ('email_verify', 'password_reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting for verification attempts
CREATE TABLE IF NOT EXISTS public.verification_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address TEXT,
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Index for OTP verification queries
CREATE INDEX idx_verification_otp_email ON public.verification_otp(email);
CREATE INDEX idx_verification_otp_user_id ON public.verification_otp(user_id);
CREATE INDEX idx_verification_attempts_email ON public.verification_attempts(email);

-- =============================================
-- PART 3: INDEXES
-- =============================================
-- Create indexes for better query performance
CREATE INDEX idx_members_user_id ON public.members(user_id);
CREATE INDEX idx_members_status ON public.members(status);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_giving_transactions_member_id ON public.giving_transactions(member_id);
CREATE INDEX idx_giving_transactions_date ON public.giving_transactions(transaction_date);
CREATE INDEX idx_sermons_date ON public.sermons(sermon_date);
CREATE INDEX idx_prayer_requests_member_id ON public.prayer_requests(member_id);
CREATE INDEX idx_attendance_member_id ON public.attendance(member_id);
CREATE INDEX idx_attendance_event_id ON public.attendance(event_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
-- Note: pgvector index removed - vector embedding column removed from sermons table

-- =============================================
-- PART 4: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giving_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Members RLS Policies
CREATE POLICY "Users can view their own member profile" ON public.members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view other members" ON public.members
  FOR SELECT USING (status = 'active' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile" ON public.members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage members" ON public.members
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User Roles RLS
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Events RLS
CREATE POLICY "Public events are viewable" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can update" ON public.events
  FOR UPDATE USING (auth.uid() = created_by);

-- Giving Transactions RLS
CREATE POLICY "Members can view their own giving" ON public.giving_transactions
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.members WHERE id = member_id));

CREATE POLICY "Treasurers can view all giving" ON public.giving_transactions
  FOR SELECT USING (auth.jwt() ->> 'role' = 'treasurer');

CREATE POLICY "Members can insert their own giving" ON public.giving_transactions
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.members WHERE id = member_id));

-- Prayer Requests RLS
CREATE POLICY "Private prayer requests only visible to requester" ON public.prayer_requests
  FOR SELECT USING (
    is_private = FALSE 
    OR auth.uid() = (SELECT user_id FROM public.members WHERE id = member_id)
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Members can create prayer requests" ON public.prayer_requests
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.members WHERE id = member_id));

-- Notifications RLS
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Audit Logs RLS
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Service role can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- =============================================
-- OTP Verification RLS Policies
-- =============================================

-- Enable RLS on verification tables
ALTER TABLE public.verification_otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_attempts ENABLE ROW LEVEL SECURITY;

-- Verification OTP: Allow service role to manage, users can only insert and verify their own
CREATE POLICY "Service role can manage OTP" ON public.verification_otp
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can insert OTP" ON public.verification_otp
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own OTP" ON public.verification_otp
  FOR UPDATE USING (auth.uid() = user_id);

-- Verification Attempts: Allow service role to manage
CREATE POLICY "Service role can manage attempts" ON public.verification_attempts
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Anyone can insert attempts" ON public.verification_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update attempts" ON public.verification_attempts
  FOR UPDATE USING (true);

-- =============================================
-- PART 5: SEED DATA
-- =============================================
-- Seed data for development
INSERT INTO public.songs (title, artist, composer, key, genre) VALUES
('Amazing Grace', 'John Newton', 'John Newton', 'G', 'Hymn'),
('How Great Thou Art', 'Carl Boberg', 'Carl Boberg', 'D', 'Hymn'),
('Jesus Loves Me', 'Anna Bartlett Warner', 'William Batchelder Bradbury', 'F', 'Children'),
('What A Friend We Have In Jesus', 'Joseph Scriven', 'Charles Converse', 'C', 'Hymn'),
('The Lord Is My Shepherd', 'Isaac Watts', 'Jesse Seely Smith', 'G', 'Spiritual'),
('Jesus Christ Is Risen Today', 'Charles Spurgeon', 'Carl Philipp Emanuel Bach', 'D', 'Easter'),
('O Come, All Ye Faithful', 'Frederick Oakeley', 'John Francis Wade', 'G', 'Christmas'),
('Silent Night', 'Joseph Mohr', 'Franz Xaver Gruber', 'F', 'Christmas');

INSERT INTO public.sermon_series (title, description, start_date, end_date) VALUES
('Foundations of Faith', 'A journey through the basics of Christian faith', '2024-01-01', '2024-03-31'),
('Books of the Bible', 'Deep dive into different books of the Bible', '2024-04-01', '2024-12-31');

-- Add more seed data as needed
