-- =============================================
-- Hopewell Church Management System - Complete SQL Schema
-- Single comprehensive schema file with all tables, relationships, and policies
-- =============================================

-- =============================================
-- PART 1: EXTENSIONS
-- =============================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PART 2: USER ROLES ENUM TYPE
-- =============================================
-- Create enum type for user roles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM (
      'admin', 
      'pastor', 
      'treasurer',
      'secretary',
      'member', 
      'praise-worship', 
      'ushering'
    );
  END IF;
END $$;

-- Create enum types for various fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
    CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'marital_status_type') THEN
    CREATE TYPE public.marital_status_type AS ENUM ('single', 'married', 'divorced', 'widowed');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_type') THEN
    CREATE TYPE public.user_status_type AS ENUM ('active', 'inactive', 'pending', 'suspended');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status_type') THEN
    CREATE TYPE public.event_status_type AS ENUM ('draft', 'published', 'cancelled', 'completed');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registration_status_type') THEN
    CREATE TYPE public.registration_status_type AS ENUM ('registered', 'attended', 'no-show', 'cancelled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'giving_type_type') THEN
    CREATE TYPE public.giving_type_type AS ENUM ('tithe', 'offering', 'special', 'building_fund', 'missions', 'benevolence');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_type') THEN
    CREATE TYPE public.payment_method_type AS ENUM ('mpesa', 'stripe', 'cash', 'bank_transfer');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status_type') THEN
    CREATE TYPE public.transaction_status_type AS ENUM ('pending', 'completed', 'failed', 'refunded');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_status_type') THEN
    CREATE TYPE public.expense_status_type AS ENUM ('pending', 'approved', 'rejected', 'paid');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'group_type_type') THEN
    CREATE TYPE public.group_type_type AS ENUM ('small_group', 'ministry', 'committee', 'fellowship');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prayer_status_type') THEN
    CREATE TYPE public.prayer_status_type AS ENUM ('open', 'answered', 'closed');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'setlist_status_type') THEN
    CREATE TYPE public.setlist_status_type AS ENUM ('draft', 'finalized', 'archived');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'check_in_method_type') THEN
    CREATE TYPE public.check_in_method_type AS ENUM ('manual', 'qr', 'auto');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shift_status_type') THEN
    CREATE TYPE public.shift_status_type AS ENUM ('scheduled', 'confirmed', 'completed', 'no_show');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type_type') THEN
    CREATE TYPE public.notification_type_type AS ENUM ('sms', 'email', 'push', 'in_app');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status_type') THEN
    CREATE TYPE public.notification_status_type AS ENUM ('pending', 'sent', 'failed', 'read');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pastoral_note_type') THEN
    CREATE TYPE public.pastoral_note_type AS ENUM ('visit', 'counselling', 'prayer', 'follow_up', 'general');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'spiritual_entry_type') THEN
    CREATE TYPE public.spiritual_entry_type AS ENUM ('bible_reading', 'prayer', 'devotion', 'fasting', 'service');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'equipment_condition_type') THEN
    CREATE TYPE public.equipment_condition_type AS ENUM ('excellent', 'good', 'fair', 'poor', 'broken');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_severity_type') THEN
    CREATE TYPE public.incident_severity_type AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_status_type') THEN
    CREATE TYPE public.incident_status_type AS ENUM ('reported', 'investigating', 'resolved', 'closed');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'follower_status_type') THEN
    CREATE TYPE public.follower_status_type AS ENUM ('pending', 'contacted', 'interested', 'joined', 'declined');
  END IF;
END $$;

-- =============================================
-- PART 3: CORE USER TABLE
-- =============================================
-- Users table - central table for all church members/users
-- Role is stored as a field (member is a role, not a separate table)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender public.gender_type,
  marital_status public.marital_status_type,
  address TEXT,
  county TEXT,
  occupation TEXT,
  profile_image_url TEXT,
  membership_date DATE,
  status public.user_status_type NOT NULL DEFAULT 'active',
  role public.user_role NOT NULL DEFAULT 'member',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  baptism_date DATE,
  salvation_date DATE,
  family_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(auth_user_id)
);

-- =============================================
-- PART 4: USER ROLES TABLE (for additional roles - supports multiple roles per user)
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'pastor', 'treasurer', 'secretary', 'member', 'praise-worship', 'ushering')),
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- =============================================
-- PART 5: CAMPUS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 6: FAMILY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_name TEXT NOT NULL,
  head_of_family_id UUID REFERENCES public.users(id),
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 7: CHURCH MANAGEMENT TABLES
-- =============================================

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
  status public.event_status_type DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  campus_id UUID REFERENCES public.campuses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status public.registration_status_type DEFAULT 'registered',
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Sermons table
CREATE TABLE IF NOT EXISTS public.sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  speaker_id UUID NOT NULL REFERENCES public.users(id),
  sermon_series_id UUID REFERENCES public.sermon_series(id),
  sermon_date DATE NOT NULL,
  scripture_references TEXT[],
  audio_url TEXT,
  video_url TEXT,
  transcript TEXT,
  notes TEXT,
  mux_playback_id TEXT,
  mux_asset_id TEXT,
  duration_minutes INTEGER,
  tags TEXT[],
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sermon Series table
CREATE TABLE IF NOT EXISTS public.sermon_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Giving Transactions table
CREATE TABLE IF NOT EXISTS public.giving_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  giving_type public.giving_type_type NOT NULL,
  payment_method public.payment_method_type NOT NULL,
  transaction_reference TEXT,
  mpesa_receipt TEXT,
  stripe_payment_id TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status public.transaction_status_type DEFAULT 'completed',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  notes TEXT,
  anonymous BOOLEAN DEFAULT FALSE,
  campus_id UUID REFERENCES public.campuses(id),
  recurring_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  category TEXT NOT NULL,
  vendor TEXT,
  expense_date DATE NOT NULL,
  paid_by UUID REFERENCES public.users(id),
  payment_method TEXT,
  receipt_url TEXT,
  approved_by UUID REFERENCES auth.users(id),
  status public.expense_status_type DEFAULT 'pending',
  budget_id UUID REFERENCES public.budgets(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  allocated_amount DECIMAL(15, 2) NOT NULL,
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) NOT NULL,
  fiscal_year INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  campus_id UUID REFERENCES public.campuses(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pledges table
CREATE TABLE IF NOT EXISTS public.pledges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  campaign_name TEXT,
  pledged_amount DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  purpose TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table (small groups, cell groups, ministry teams)
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  group_type public.group_type_type NOT NULL,
  leader_id UUID REFERENCES public.users(id),
  meeting_schedule TEXT,
  meeting_location TEXT,
  image_url TEXT,
  max_members INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  campus_id UUID REFERENCES public.campuses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'co-leader', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Prayer Requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  is_private BOOLEAN DEFAULT FALSE,
  status public.prayer_status_type DEFAULT 'open',
  prayer_count INTEGER DEFAULT 0,
  ai_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  key TEXT,
  tempo INTEGER,
  lyrics TEXT,
  chord_chart_url TEXT,
  audio_url TEXT,
  ccli_number TEXT,
  tags TEXT[],
  last_used DATE,
  times_used INTEGER DEFAULT 0,
  composer TEXT,
  duration INTEGER,
  genre TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setlists table
CREATE TABLE IF NOT EXISTS public.setlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id),
  service_date DATE,
  service_type TEXT,
  notes TEXT,
  status public.setlist_status_type DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setlist Songs table
CREATE TABLE IF NOT EXISTS public.setlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setlist_id UUID NOT NULL REFERENCES public.setlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id),
  song_order INTEGER NOT NULL,
  key_override TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  event_id UUID REFERENCES public.events(id),
  attended BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  check_in_method public.check_in_method_type DEFAULT 'manual',
  campus_id UUID REFERENCES public.campuses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Volunteer Shifts table
CREATE TABLE IF NOT EXISTS public.volunteer_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  ministry TEXT NOT NULL,
  role TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id),
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status public.shift_status_type DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 8: NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES public.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type public.notification_type_type DEFAULT 'in_app',
  status public.notification_status_type DEFAULT 'pending',
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 9: PAYMENT TABLES
-- =============================================

-- M-Pesa Transactions table
CREATE TABLE IF NOT EXISTS public.mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  merchant_request_id TEXT,
  checkout_request_id TEXT UNIQUE,
  account_reference TEXT,
  transaction_desc TEXT,
  response_code TEXT,
  response_description TEXT,
  result_code INTEGER,
  result_description TEXT,
  transaction_date TEXT,
  mpesa_receipt_number TEXT,
  status public.transaction_status_type DEFAULT 'pending',
  giving_transaction_id UUID REFERENCES public.giving_transactions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 10: PASTORAL CARE TABLES
-- =============================================

-- Pastoral Care Notes table
CREATE TABLE IF NOT EXISTS public.pastoral_care_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pastor_id UUID NOT NULL REFERENCES public.users(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  note_type public.pastoral_note_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spiritual Growth Entries table
CREATE TABLE IF NOT EXISTS public.spiritual_growth_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  entry_type public.spiritual_entry_type NOT NULL,
  title TEXT,
  notes TEXT,
  duration_minutes INTEGER,
  scripture_reference TEXT,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer Journal Entries table
CREATE TABLE IF NOT EXISTS public.prayer_journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  scripture_reference TEXT,
  is_answered BOOLEAN DEFAULT FALSE,
  answered_date DATE,
  answered_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 11: FACILITIES & EQUIPMENT TABLES
-- =============================================

-- Equipment Items table
CREATE TABLE IF NOT EXISTS public.equipment_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  condition public.equipment_condition_type DEFAULT 'good',
  location TEXT,
  last_maintenance DATE,
  next_maintenance DATE,
  assigned_to UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incident Reports table
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_by UUID NOT NULL REFERENCES public.users(id),
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  severity public.incident_severity_type NOT NULL,
  status public.incident_status_type DEFAULT 'reported',
  resolution_notes TEXT,
  incident_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 12: VISITOR MANAGEMENT
-- =============================================
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  visit_date DATE NOT NULL,
  how_heard TEXT,
  notes TEXT,
  follow_up_status TEXT DEFAULT 'pending' CHECK (follow_up_status IN ('pending', 'contacted', 'interested', 'joined', 'declined')),
  assigned_to UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 13: AUDIT LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 14: OTP VERIFICATION TABLES
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

-- =============================================
-- PART 15: INDEXES
-- =============================================
-- Performance indexes
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_family_id ON public.users(family_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_campus_id ON public.events(campus_id);
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX idx_sermons_speaker_id ON public.sermons(speaker_id);
CREATE INDEX idx_sermons_sermon_date ON public.sermons(sermon_date);
CREATE INDEX idx_sermons_series_id ON public.sermons(sermon_series_id);
CREATE INDEX idx_giving_transactions_user_id ON public.giving_transactions(user_id);
CREATE INDEX idx_giving_transactions_date ON public.giving_transactions(transaction_date);
CREATE INDEX idx_giving_transactions_status ON public.giving_transactions(status);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_status ON public.expenses(status);
CREATE INDEX idx_budgets_fiscal_year ON public.budgets(fiscal_year);
CREATE INDEX idx_budgets_category ON public.budgets(category);
CREATE INDEX idx_pledges_user_id ON public.pledges(user_id);
CREATE INDEX idx_pledges_status ON public.pledges(status);
CREATE INDEX idx_groups_leader_id ON public.groups(leader_id);
CREATE INDEX idx_groups_type ON public.groups(group_type);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_prayer_requests_user_id ON public.prayer_requests(user_id);
CREATE INDEX idx_prayer_requests_status ON public.prayer_requests(status);
CREATE INDEX idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX idx_attendance_event_id ON public.attendance(event_id);
CREATE INDEX idx_attendance_date ON public.attendance(created_at);
CREATE INDEX idx_volunteer_shifts_user_id ON public.volunteer_shifts(user_id);
CREATE INDEX idx_volunteer_shifts_date ON public.volunteer_shifts(shift_date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_mpesa_transactions_phone ON public.mpesa_transactions(phone_number);
CREATE INDEX idx_mpesa_transactions_checkout_id ON public.mpesa_transactions(checkout_request_id);
CREATE INDEX idx_pastoral_care_user_id ON public.pastoral_care_notes(user_id);
CREATE INDEX idx_pastoral_care_pastor_id ON public.pastoral_care_notes(pastor_id);
CREATE INDEX idx_spiritual_growth_user_id ON public.spiritual_growth_entries(user_id);
CREATE INDEX idx_spiritual_growth_date ON public.spiritual_growth_entries(entry_date);
CREATE INDEX idx_prayer_journal_user_id ON public.prayer_journal_entries(user_id);
CREATE INDEX idx_equipment_items_category ON public.equipment_items(category);
CREATE INDEX idx_equipment_items_location ON public.equipment_items(location);
CREATE INDEX idx_incident_reports_date ON public.incident_reports(incident_date);
CREATE INDEX idx_incident_reports_status ON public.incident_reports(status);
CREATE INDEX idx_incident_reports_severity ON public.incident_reports(severity);
CREATE INDEX idx_visitors_date ON public.visitors(visit_date);
CREATE INDEX idx_visitors_follow_up ON public.visitors(follow_up_status);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);
CREATE INDEX idx_verification_otp_email ON public.verification_otp(email);
CREATE INDEX idx_verification_otp_user_id ON public.verification_otp(user_id);
CREATE INDEX idx_verification_attempts_email ON public.verification_attempts(email);

-- =============================================
-- PART 16: TRIGGER FUNCTION FOR AUTO USER CREATION
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into users table using auth.users data
  INSERT INTO public.users (
    id,
    auth_user_id,
    first_name,
    last_name,
    email,
    phone,
    status,
    membership_date,
    role
  )
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Member'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'active',
    CURRENT_DATE,
    'member'
  );

  -- Insert default 'member' role into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

-- =============================================
-- PART 17: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giving_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.pastoral_care_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_growth_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_attempts ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can view active members" ON public.users
  FOR SELECT USING (status = 'active' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- User Roles RLS
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = user_id 
      AND auth_user_id = auth.uid()
    )
  );

-- Campuses RLS
CREATE POLICY "Anyone can view campuses" ON public.campuses
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage campuses" ON public.campuses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Families RLS
CREATE POLICY "Family members can view their family" ON public.families
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND (id = head_of_family_id OR family_id = id)
    )
  );

CREATE POLICY "Admins can manage families" ON public.families
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Events RLS
CREATE POLICY "Public events are viewable" ON public.events
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can update" ON public.events
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Event creators can delete" ON public.events
  FOR DELETE USING (auth.uid() = created_by);

-- Event Registrations RLS
CREATE POLICY "Users can view their own registrations" ON public.event_registrations
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

CREATE POLICY "Users can create registrations" ON public.event_registrations
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

-- Sermons RLS
CREATE POLICY "Anyone can view sermons" ON public.sermons
  FOR SELECT USING (true);

CREATE POLICY "Pastors and admins can manage sermons" ON public.sermons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('pastor', 'admin')
    )
  );

-- Sermon Series RLS
CREATE POLICY "Anyone can view sermon series" ON public.sermon_series
  FOR SELECT USING (true);

CREATE POLICY "Pastors and admins can manage sermon series" ON public.sermon_series
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('pastor', 'admin')
    )
  );

-- Giving Transactions RLS
CREATE POLICY "Users can view their own giving" ON public.giving_transactions
  FOR SELECT USING (
    anonymous = FALSE 
    AND (
      auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
      OR EXISTS (
        SELECT 1 FROM public.users 
        WHERE auth_user_id = auth.uid() 
        AND role IN ('treasurer', 'admin')
      )
    )
  );

CREATE POLICY "Users can insert their own giving" ON public.giving_transactions
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
    OR user_id IS NULL
  );

-- Expenses RLS
CREATE POLICY "Treasurers and admins can manage expenses" ON public.expenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('treasurer', 'admin')
    )
  );

CREATE POLICY "Users can view approved expenses" ON public.expenses
  FOR SELECT USING (status = 'approved');

-- Budgets RLS
CREATE POLICY "Treasurers and admins can manage budgets" ON public.budgets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('treasurer', 'admin')
    )
  );

CREATE POLICY "Users can view budgets" ON public.budgets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND status = 'active'
    )
  );

-- Pledges RLS
CREATE POLICY "Users can view their own pledges" ON public.pledges
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

CREATE POLICY "Treasurers can view all pledges" ON public.pledges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('treasurer', 'admin')
    )
  );

CREATE POLICY "Users can create pledges" ON public.pledges
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

-- Groups RLS
CREATE POLICY "Active users can view groups" ON public.groups
  FOR SELECT USING (is_active = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Group leaders can manage their groups" ON public.groups
  FOR ALL USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = leader_id)
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Group Members RLS
CREATE POLICY "Group members can view group members" ON public.group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Group leaders can manage group members" ON public.group_members
  FOR ALL USING (
    auth.uid() = (
      SELECT auth_user_id FROM public.users 
      WHERE id = (SELECT leader_id FROM public.groups WHERE id = group_id)
    )
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Prayer Requests RLS
CREATE POLICY "Prayer requests visible to appropriate users" ON public.prayer_requests
  FOR SELECT USING (
    is_private = FALSE 
    OR is_public = TRUE
    OR auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

CREATE POLICY "Users can create prayer requests" ON public.prayer_requests
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
    OR user_id IS NULL
  );

CREATE POLICY "Users can update their own prayer requests" ON public.prayer_requests
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Songs RLS
CREATE POLICY "Anyone can view songs" ON public.songs
  FOR SELECT USING (true);

CREATE POLICY "Praise-worship team and admins can manage songs" ON public.songs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('praise-worship', 'admin')
    )
  );

-- Setlists RLS
CREATE POLICY "Users can view setlists" ON public.setlists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Users can create setlists" ON public.setlists
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Setlist creators can update" ON public.setlists
  FOR UPDATE USING (auth.uid() = created_by);

-- Setlist Songs RLS
CREATE POLICY "Users can view setlist songs" ON public.setlist_songs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Users can manage setlist songs" ON public.setlist_songs
  FOR ALL USING (
    auth.uid() = (
      SELECT auth_user_id FROM public.users 
      WHERE id = (SELECT created_by FROM public.setlists WHERE id = setlist_id)
    )
  );

-- Attendance RLS
CREATE POLICY "Users can view their own attendance" ON public.attendance
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

CREATE POLICY "Event creators can manage attendance" ON public.attendance
  FOR ALL USING (
    auth.uid() = (
      SELECT auth_user_id FROM public.users 
      WHERE id = (SELECT created_by FROM public.events WHERE id = event_id)
    )
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('admin', 'ushering')
    )
  );

-- Volunteer Shifts RLS
CREATE POLICY "Users can view volunteer shifts" ON public.volunteer_shifts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Users can manage their own volunteer shifts" ON public.volunteer_shifts
  FOR ALL USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Notifications RLS
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = recipient_id
  );

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (
    auth.uid() = user_id OR auth.uid() = recipient_id
  );

CREATE POLICY "Users can mark notifications as read" ON public.notifications
  FOR UPDATE USING (
    auth.uid() = user_id OR auth.uid() = recipient_id
  );

-- M-Pesa Transactions RLS
CREATE POLICY "Treasurers can view mpesa transactions" ON public.mpesa_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('treasurer', 'admin')
    )
  );

-- Pastoral Care Notes RLS
CREATE POLICY "Pastors can view pastoral notes" ON public.pastoral_care_notes
  FOR SELECT USING (
    pastor_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Pastors can manage pastoral notes" ON public.pastoral_care_notes
  FOR ALL USING (
    pastor_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('pastor', 'admin')
    )
  );

-- Spiritual Growth Entries RLS
CREATE POLICY "Users can view their own spiritual growth" ON public.spiritual_growth_entries
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

CREATE POLICY "Users can manage their own spiritual growth" ON public.spiritual_growth_entries
  FOR ALL USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

-- Prayer Journal Entries RLS
CREATE POLICY "Users can view their own prayer journal" ON public.prayer_journal_entries
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

CREATE POLICY "Users can manage their own prayer journal" ON public.prayer_journal_entries
  FOR ALL USING (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id)
  );

-- Equipment Items RLS
CREATE POLICY "Users can view equipment" ON public.equipment_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Admins can manage equipment" ON public.equipment_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Incident Reports RLS
CREATE POLICY "Users can view incident reports" ON public.incident_reports
  FOR SELECT USING (
    reported_by = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

CREATE POLICY "Users can create incident reports" ON public.incident_reports
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = reported_by)
  );

CREATE POLICY "Admins can manage incident reports" ON public.incident_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Visitors RLS
CREATE POLICY "Users can view visitors" ON public.visitors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Admins can manage visitors" ON public.visitors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Audit Logs RLS
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Service role can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Verification OTP RLS
CREATE POLICY "Service role can manage OTP" ON public.verification_otp
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pg_authid 
      WHERE rolname = current_user 
      AND rolname = 'service_role'
    )
  );

CREATE POLICY "Users can insert OTP" ON public.verification_otp
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own OTP" ON public.verification_otp
  FOR UPDATE USING (auth.uid() = user_id);

-- Verification Attempts RLS
CREATE POLICY "Service role can manage attempts" ON public.verification_attempts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pg_authid 
      WHERE rolname = current_user 
      AND rolname = 'service_role'
    )
  );

CREATE POLICY "Anyone can insert attempts" ON public.verification_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update attempts" ON public.verification_attempts
  FOR UPDATE USING (true);

-- =============================================
-- PART 18: GRANT PERMISSIONS
-- =============================================
-- Grant table permissions to authenticated users
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.campuses TO authenticated;
GRANT SELECT ON public.families TO authenticated;
GRANT SELECT ON public.events TO authenticated;
GRANT SELECT ON public.event_registrations TO authenticated;
GRANT SELECT ON public.sermons TO authenticated;
GRANT SELECT ON public.sermon_series TO authenticated;
GRANT SELECT ON public.giving_transactions TO authenticated;
GRANT SELECT ON public.expenses TO authenticated;
GRANT SELECT ON public.budgets TO authenticated;
GRANT SELECT ON public.pledges TO authenticated;
GRANT SELECT ON public.groups TO authenticated;
GRANT SELECT ON public.group_members TO authenticated;
GRANT SELECT ON public.prayer_requests TO authenticated;
GRANT SELECT ON public.songs TO authenticated;
GRANT SELECT ON public.setlists TO authenticated;
GRANT SELECT ON public.setlist_songs TO authenticated;
GRANT SELECT ON public.attendance TO authenticated;
GRANT SELECT ON public.volunteer_shifts TO authenticated;
GRANT SELECT ON public.notifications TO authenticated;
GRANT SELECT ON public.mpesa_transactions TO authenticated;
GRANT SELECT ON public.pastoral_care_notes TO authenticated;
GRANT SELECT ON public.spiritual_growth_entries TO authenticated;
GRANT SELECT ON public.prayer_journal_entries TO authenticated;
GRANT SELECT ON public.equipment_items TO authenticated;
GRANT SELECT ON public.incident_reports TO authenticated;
GRANT SELECT ON public.visitors TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT ON public.verification_otp TO authenticated;
GRANT SELECT ON public.verification_attempts TO authenticated;

-- Grant all permissions to service_role
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_roles TO service_role;
GRANT ALL ON public.campuses TO service_role;
GRANT ALL ON public.families TO service_role;
GRANT ALL ON public.events TO service_role;
GRANT ALL ON public.event_registrations TO service_role;
GRANT ALL ON public.sermons TO service_role;
GRANT ALL ON public.sermon_series TO service_role;
GRANT ALL ON public.giving_transactions TO service_role;
GRANT ALL ON public.expenses TO service_role;
GRANT ALL ON public.budgets TO service_role;
GRANT ALL ON public.pledges TO service_role;
GRANT ALL ON public.groups TO service_role;
GRANT ALL ON public.group_members TO service_role;
GRANT ALL ON public.prayer_requests TO service_role;
GRANT ALL ON public.songs TO service_role;
GRANT ALL ON public.setlists TO service_role;
GRANT ALL ON public.setlist_songs TO service_role;
GRANT ALL ON public.attendance TO service_role;
GRANT ALL ON public.volunteer_shifts TO service_role;
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.mpesa_transactions TO service_role;
GRANT ALL ON public.pastoral_care_notes TO service_role;
GRANT ALL ON public.spiritual_growth_entries TO service_role;
GRANT ALL ON public.prayer_journal_entries TO service_role;
GRANT ALL ON public.equipment_items TO service_role;
GRANT ALL ON public.incident_reports TO service_role;
GRANT ALL ON public.visitors TO service_role;
GRANT ALL ON public.audit_logs TO service_role;
GRANT ALL ON public.verification_otp TO service_role;
GRANT ALL ON public.verification_attempts TO service_role;

-- =============================================
-- SCHEMA COMPLETE
-- =============================================
