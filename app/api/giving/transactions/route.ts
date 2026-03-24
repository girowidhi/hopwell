import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get giving transactions for the user's member profile
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

    const { data: transactions } = await supabase
      .from("giving_transactions")
      .select("*")
      .eq("member_id", memberData.id)
      .order("transaction_date", { ascending: false });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { amount, givingType, paymentMethod } = await request.json();

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

    // Create transaction
    const { data, error } = await supabase
      .from("giving_transactions")
      .insert({
        member_id: memberData.id,
        amount,
        giving_type: givingType,
        payment_method: paymentMethod,
        transaction_date: new Date().toISOString(),
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ transaction: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
