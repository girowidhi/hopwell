export interface Member {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  marital_status?: "single" | "married" | "divorced" | "widowed";
  address?: string;
  county?: string;
  occupation?: string;
  profile_image_url?: string;
  membership_date?: string;
  status: "active" | "inactive" | "pending" | "suspended";
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  baptism_date?: string;
  salvation_date?: string;
  family_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "pastor" | "member" | "treasurer" | "praise-worship" | "ushering";
  assigned_by?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location?: string;
  is_recurring: boolean;
  recurrence_rule?: string;
  max_attendees?: number;
  registration_required: boolean;
  image_url?: string;
  created_by: string;
  campus_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  member_id: string;
  status: "registered" | "attended" | "cancelled";
  checked_in_at?: string;
  created_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  description?: string;
  speaker: string;
  series_id?: string;
  date: string;
  scripture_references?: string[];
  audio_url?: string;
  video_url?: string;
  transcript?: string;
  notes?: string;
  mux_playback_id?: string;
  mux_asset_id?: string;
  duration_minutes?: number;
  tags?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SermonSeries {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  start_date: string;
  end_date?: string;
  created_by: string;
  created_at: string;
}

export interface GivingTransaction {
  id: string;
  member_id?: string;
  amount: number;
  currency: string;
  giving_type: string;
  payment_method: string;
  transaction_reference?: string;
  mpesa_receipt?: string;
  stripe_payment_id?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  is_recurring: boolean;
  recurrence_rule?: string;
  notes?: string;
  anonymous: boolean;
  date: string;
  campus_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: string;
  vendor?: string;
  receipt_url?: string;
  approved_by?: string;
  status: "pending" | "approved" | "rejected" | "paid";
  date: string;
  budget_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  name: string;
  description?: string;
  total_amount: number;
  spent_amount: number;
  period_start: string;
  period_end: string;
  category: string;
  campus_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Pledge {
  id: string;
  member_id: string;
  campaign_name: string;
  pledged_amount: number;
  paid_amount: number;
  currency: string;
  start_date: string;
  end_date?: string;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  group_type: "small_group" | "ministry" | "committee" | "fellowship";
  leader_id?: string;
  meeting_schedule?: string;
  meeting_location?: string;
  image_url?: string;
  max_members?: number;
  is_active: boolean;
  campus_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  member_id: string;
  role: "leader" | "co-leader" | "member";
  joined_at: string;
}

export interface PrayerRequest {
  id: string;
  member_id?: string;
  title: string;
  description: string;
  category: string;
  is_anonymous: boolean;
  is_public: boolean;
  status: "open" | "answered" | "closed";
  prayer_count: number;
  ai_category?: string;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  key?: string;
  tempo?: number;
  lyrics?: string;
  chord_chart_url?: string;
  audio_url?: string;
  ccli_number?: string;
  tags?: string[];
  last_used?: string;
  times_used: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Setlist {
  id: string;
  title: string;
  service_date: string;
  service_type?: string;
  notes?: string;
  status: "draft" | "finalized" | "archived";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SetlistSong {
  id: string;
  setlist_id: string;
  song_id: string;
  order_index: number;
  key_override?: string;
  notes?: string;
}

export interface Attendance {
  id: string;
  event_id?: string;
  member_id: string;
  check_in_time: string;
  check_out_time?: string;
  check_in_method: "manual" | "qr" | "auto";
  campus_id?: string;
  created_at: string;
}

export interface VolunteerShift {
  id: string;
  member_id: string;
  ministry: string;
  role: string;
  event_id?: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "confirmed" | "completed" | "no_show";
  notes?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: "sms" | "email" | "push" | "in_app";
  status: "pending" | "sent" | "failed" | "read";
  read_at?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface MpesaTransaction {
  id: string;
  merchant_request_id: string;
  checkout_request_id: string;
  phone_number: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
  mpesa_receipt_number?: string;
  result_code?: number;
  result_desc?: string;
  status: "pending" | "completed" | "failed";
  giving_transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface PastoralCareNote {
  id: string;
  pastor_id: string;
  member_id: string;
  note_type: "visit" | "counselling" | "prayer" | "follow_up" | "general";
  title: string;
  content: string;
  is_confidential: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface SpiritualGrowthEntry {
  id: string;
  member_id: string;
  entry_type: "bible_reading" | "prayer" | "devotion" | "fasting" | "service";
  title?: string;
  notes?: string;
  duration_minutes?: number;
  scripture_reference?: string;
  date: string;
  created_at: string;
}

export interface PrayerJournalEntry {
  id: string;
  member_id: string;
  title: string;
  content: string;
  scripture_reference?: string;
  is_answered: boolean;
  answered_date?: string;
  answered_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  condition: "excellent" | "good" | "fair" | "poor" | "broken";
  location?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentReport {
  id: string;
  reported_by: string;
  incident_type: string;
  description: string;
  location?: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "reported" | "investigating" | "resolved" | "closed";
  resolution_notes?: string;
  incident_date: string;
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  visit_date: string;
  how_heard?: string;
  notes?: string;
  follow_up_status: "pending" | "contacted" | "joined" | "declined";
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard stat types
export interface DashboardStat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}
