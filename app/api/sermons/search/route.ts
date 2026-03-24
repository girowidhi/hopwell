// API Route for handling sermon search with pgvector embeddings
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // For now, search by title/description
    // In production, you would generate embeddings and use pgvector
    const { data: results, error } = await supabase
      .from("sermons")
      .select("*")
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,transcript.ilike.%${query}%`
      )
      .order("sermon_date", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Error searching sermons:", error);
    return NextResponse.json(
      { error: "Failed to search sermons" },
      { status: 500 }
    );
  }
}
