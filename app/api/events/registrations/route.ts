// API Route for handling event registrations
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Get registrations for event
    const { data: registrations, error } = await supabase
      .from("event_registrations")
      .select("*, members(*)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { eventId } = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get member
    const { data: memberData } = await supabase
      .from("members")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!memberData) {
      return NextResponse.json(
        { error: "Member profile not found" },
        { status: 404 }
      );
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        member_id: memberData.id,
        status: "registered",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}
