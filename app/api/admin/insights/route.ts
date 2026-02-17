import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you might want to add a proper admin check)
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    // For now, allow any authenticated user to access admin features
    // In production, you should implement proper admin role checking

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const filter = searchParams.get("filter");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const offset = (page - 1) * limit;

    console.log("Insights API received params:", {
      search,
      filter,
      page,
      limit,
      sort,
      order,
      offset,
    });

    let query = supabase.from("insights").select("*", { count: "exact" });

    // Apply search filter
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,author.ilike.%${search}%`
      );
    }

    // Apply category filter
    if (filter && filter !== "all") {
      query = query.eq("category", filter);
    }

    // Apply sorting
    const validSortFields = [
      "title",
      "category",
      "author",
      "post_date",
      "created_at",
      "published",
      "featured",
    ];
    const validOrderDirections = ["asc", "desc"];

    console.log("Sort validation:", {
      sort,
      order,
      isValidSort: validSortFields.includes(sort),
      isValidOrder: validOrderDirections.includes(order),
    });

    if (
      validSortFields.includes(sort) &&
      validOrderDirections.includes(order)
    ) {
      query = query.order(sort, { ascending: order === "asc" });
      console.log("Applied sorting:", {
        sort,
        order,
        ascending: order === "asc",
      });
    } else {
      // Default sorting
      query = query.order("created_at", { ascending: false });
      console.log("Applied default sorting: created_at desc");
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: insights, error, count } = await query;

    if (error) {
      console.error("Error fetching insights:", error);
      return NextResponse.json(
        { error: "Failed to fetch insights" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      insights: insights || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error in insights GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

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

    // Generate unique insight_id: i + 10 random digits
    const generateInsightId = () => {
      const digits = Math.floor(Math.random() * 10000000000)
        .toString()
        .padStart(10, "0");
      return `i${digits}`;
    };

    let insight_id = generateInsightId();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure unique insight_id
    while (attempts < maxAttempts) {
      const { data: existingInsight } = await supabase
        .from("insights")
        .select("id")
        .eq("insight_id", insight_id)
        .single();

      if (!existingInsight) {
        break; // Unique ID found
      }

      insight_id = generateInsightId();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: "Failed to generate unique Insight ID" },
        { status: 500 }
      );
    }

    // Insert new insight
    const { data: newInsight, error } = await supabase
      .from("insights")
      .insert({
        insight_id,
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
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating insight:", error);
      return NextResponse.json(
        { error: "Failed to create insight" },
        { status: 500 }
      );
    }

    return NextResponse.json({ insight: newInsight });
  } catch (error) {
    console.error("Error in insights POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
