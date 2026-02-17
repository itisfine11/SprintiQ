import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/database.types";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Only log in development
            if (process.env.NODE_ENV === "development") {
              console.warn("Cookie set failed:", error);
            }
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Only log in development
            if (process.env.NODE_ENV === "development") {
              console.warn("Cookie remove failed:", error);
            }
          }
        },
      },
    }
  );
}

export function createMiddlewareSupabaseClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          try {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          } catch (error) {
            // Only log in development
            if (process.env.NODE_ENV === "development") {
              console.warn("Cookie set failed in middleware:", error);
            }
          }
        },
        remove(name, options) {
          try {
            request.cookies.set({ name, value: "", ...options });
            response.cookies.set({ name, value: "", ...options });
          } catch (error) {
            // Only log in development
            if (process.env.NODE_ENV === "development") {
              console.warn("Cookie remove failed in middleware:", error);
            }
          }
        },
      },
    }
  );
}
