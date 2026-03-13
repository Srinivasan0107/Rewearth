import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
    }

    if (session?.user) {
      const { user } = session;
      const username = user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") || `user_${Date.now()}`;
      
      try {
        // Create or update user in backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabase_auth_id: user.id,
            email: user.email,
            username,
            avatar_url: user.user_metadata?.avatar_url || null,
            bio: null,
          }),
        });

        if (!response.ok && response.status !== 400) {
          console.error("User sync failed:", await response.text());
        }
      } catch (e) {
        console.error("User sync error:", e);
      }
    }
  }

  return NextResponse.redirect(new URL("/marketplace", request.url));
}
