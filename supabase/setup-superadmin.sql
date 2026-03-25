-- This script creates the superadmin member and role
-- Run this in your Supabase SQL Editor after you've created the user in the dashboard

-- Find the user by email and create member + role records
DO $
DECLARE
  user_record RECORD;
BEGIN
  -- Get the user by email
  SELECT id INTO user_record
  FROM auth.users
  WHERE email = 'toniebraxtone@gmail.com';

  IF user_record.id IS NULL THEN
    RAISE EXCEPTION 'User toniebraxtone@gmail.com not found. Please create the user in Authentication → Users first.';
  END IF;

  -- Check if member already exists
  IF NOT EXISTS (SELECT 1 FROM public.members WHERE user_id = user_record.id) THEN
    -- Create member record (phone is required)
    INSERT INTO public.members (user_id, first_name, last_name, email, phone, status)
    VALUES (user_record.id, 'Super', 'Admin', 'toniebraxtone@gmail.com', '+000000000000', 'active');
    RAISE NOTICE 'Member record created for toniebraxtone@gmail.com';
  ELSE
    RAISE NOTICE 'Member record already exists for toniebraxtone@gmail.com';
  END IF;

  -- Check if role already exists
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_record.id AND role = 'admin') THEN
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (user_record.id, 'admin', user_record.id);
    RAISE NOTICE 'Admin role assigned to toniebraxtone@gmail.com';
  ELSE
    RAISE NOTICE 'Admin role already exists for toniebraxtone@gmail.com';
  END IF;

  RAISE NOTICE 'Superadmin setup complete! User ID: %', user_record.id;
END
$;