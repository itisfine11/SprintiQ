import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Await params to get the id
    const { id } = await params;

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      post_image,
      category,
      tags,
      author,
      read_time,
      featured,
      published,
      post_date,
      links,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !post_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update insight
    const { data: updatedInsight, error } = await supabase
      .from("insights")
      .update({
        title,
        description,
        post_image,
        category,
        tags: tags || [],
        author,
        read_time,
        featured: featured || false,
        published: published !== undefined ? published : true,
        post_date,
        links: links || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating insight:", error);
      return NextResponse.json(
        { error: "Failed to update insight" },
        { status: 500 }
      );
    }

    return NextResponse.json({ insight: updatedInsight });
  } catch (error) {
    console.error("Error in insights PATCH:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Await params to get the id
    const { id } = await params;

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete insight
    const { error } = await supabase
      .from("insights")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting insight:", error);
      return NextResponse.json(
        { error: "Failed to delete insight" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in insights DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
