import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { otp, userId, email, firstName, lastName, phone } = await request.json();

    const supabase = await createClient();

    // Verify OTP (in production, call your Edge Function to verify)
    // For now, we'll assume OTP is valid

    // Create member profile
    const { error: memberError } = await supabase
      .from("members")
      .insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        status: "active",
        membership_date: new Date().toISOString().split("T")[0],
      });

    if (memberError) {
      throw memberError;
    }

    // Create user role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "member",
      });

    if (roleError) {
      throw roleError;
    }

    return NextResponse.json(
      { message: "Member profile created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
