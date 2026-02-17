import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  try {
    const { inviteId, userId } = await request.json();
    if (!inviteId || !userId) {
      return NextResponse.json(
        { error: "Missing inviteId or userId" },
        { status: 400 }
      );
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log("inviteId", inviteId);

    const { error: updateError } = await supabase
      .from("workspace_members")
      .update({
        status: "active",
        joined_at: new Date().toISOString(),
        user_id: userId,
      })
      .eq("id", inviteId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to accept invitation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
