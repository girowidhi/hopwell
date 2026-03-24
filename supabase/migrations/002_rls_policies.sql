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
