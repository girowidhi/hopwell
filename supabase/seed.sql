-- Seed data for development
-- ============================================

-- ============================================
-- Superadmin Setup
-- ============================================
-- IMPORTANT: Create the superadmin user via Supabase Dashboard first:
-- 1. Go to Authentication → Users
-- 2. Click "Add user"
-- 3. Enter email: admin@hopewellchms.com
-- 4. Enter a password (e.g., Admin123!)
-- 5. Click "Create user"
-- 6. Then run: supabase/setup-superadmin.sql

-- ============================================
-- Song Seed Data
-- ============================================
INSERT INTO public.songs (title, artist, composer, key, genre) VALUES
('Amazing Grace', 'John Newton', 'John Newton', 'G', 'Hymn'),
('How Great Thou Art', 'Carl Boberg', 'Carl Boberg', 'D', 'Hymn'),
('Jesus Loves Me', 'Anna Bartlett Warner', 'William Batchelder Bradbury', 'F', 'Children'),
('What A Friend We Have In Jesus', 'Joseph Scriven', 'Charles Converse', 'C', 'Hymn'),
('The Lord Is My Shepherd', 'Isaac Watts', 'Jesse Seely Smith', 'G', 'Spiritual'),
('Jesus Christ Is Risen Today', 'Charles Spurgeon', 'Carl Philipp Emanuel Bach', 'D', 'Easter'),
('O Come, All Ye Faithful', 'Frederick Oakeley', 'John Francis Wade', 'G', 'Christmas'),
('Silent Night', 'Joseph Mohr', 'Franz Xaver Gruber', 'F', 'Christmas');

-- ============================================
-- Sermon Series Seed Data
-- ============================================
INSERT INTO public.sermon_series (title, description, start_date, end_date) VALUES
('Foundations of Faith', 'A journey through the basics of Christian faith', '2024-01-01', '2024-03-31'),
('Books of the Bible', 'Deep dive into different books of the Bible', '2024-04-01', '2024-12-31');

-- ============================================
-- Test Users with Different Roles
-- ============================================
-- Note: These assume you have created users in Supabase Auth first.
-- After creating a user in Supabase Auth, note their UUID and update the IDs below.
-- Then insert into members and user_roles tables.

-- Example: If you create a user with email 'pastor@hopewellchms.com' and get UUID 'xxxxx-xxxxx'
-- Uncomment and update the following:

-- INSERT INTO public.members (id, user_id, first_name, last_name, email, phone, status, membership_date)
-- VALUES 
--   ('INSERT-PASTOR-UUID-HERE', 'INSERT-PASTOR-UUID-HERE', 'John', 'Smith', 'pastor@hopewellchms.com', '+254700000000', 'active', '2024-01-01'),
--   ('INSERT-TREASURER-UUID-HERE', 'INSERT-TREASURER-UUID-HERE', 'Sarah', 'Johnson', 'treasurer@hopewellchms.com', '+254700000001', 'active', '2024-01-01'),
--   ('INSERT-PRAISE-UUID-HERE', 'INSERT-PRAISE-UUID-HERE', 'Michael', 'Brown', 'praise@hopewellchms.com', '+254700000002', 'active', '2024-01-01'),
--   ('INSERT-USHER-UUID-HERE', 'INSERT-USHER-UUID-HERE', 'Emily', 'Davis', 'usher@hopewellchms.com', '+254700000003', 'active', '2024-01-01'),
--   ('INSERT-MEMBER-UUID-HERE', 'INSERT-MEMBER-UUID-HERE', 'David', 'Wilson', 'member@hopewellchms.com', '+254700000004', 'active', '2024-01-01'),
--   ('INSERT-ADMIN-UUID-HERE', 'INSERT-ADMIN-UUID-HERE', 'Admin', 'User', 'admin@hopewellchms.com', '+254700000005', 'active', '2024-01-01')
-- ON CONFLICT (user_id) DO NOTHING;

-- INSERT INTO public.user_roles (user_id, role) VALUES
--   ('INSERT-PASTOR-UUID-HERE', 'pastor'),
--   ('INSERT-TREASURER-UUID-HERE', 'treasurer'),
--   ('INSERT-PRAISE-UUID-HERE', 'praise-worship'),
--   ('INSERT-USHER-UUID-HERE', 'ushering'),
--   ('INSERT-MEMBER-UUID-HERE', 'member'),
--   ('INSERT-ADMIN-UUID-HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- Role Assignment Function for Existing Users
-- ============================================
-- This function can be used to assign roles to existing users
-- Usage: SELECT public.assign_user_role('USER-UUID-HERE', 'admin');

CREATE OR REPLACE FUNCTION public.assign_user_role(p_user_id UUID, p_role TEXT)
RETURNS VOID AS $$
BEGIN
  -- Insert or update member record
  INSERT INTO public.members (id, user_id, first_name, last_name, email, phone, status, membership_date)
  VALUES (p_user_id, p_user_id, 'User', 'Name', 'user@example.com', '', 'active', CURRENT_DATE)
  ON CONFLICT (user_id) DO UPDATE SET
    updated_at = NOW();

  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.assign_user_role TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_user_role TO authenticated;
