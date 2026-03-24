// Common query functions for Supabase operations
import { createClient } from "@/lib/supabase/client";

export async function getMembers(limit = 50, offset = 0) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1);

  return { data, error };
}

export async function getMemberByUserId(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { data, error };
}

export async function getUserRole(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  return { data, error };
}

export async function getEvents(limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .lte("start_date", new Date().toISOString())
    .limit(limit);

  return { data, error };
}

export async function getSermons(limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .order("sermon_date", { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getGivingTransactions(memberId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("giving_transactions")
    .select("*")
    .eq("member_id", memberId)
    .order("transaction_date", { ascending: false });

  return { data, error };
}

export async function getPrayerRequests(limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("is_private", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getGroups(limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .limit(limit);

  return { data, error };
}
