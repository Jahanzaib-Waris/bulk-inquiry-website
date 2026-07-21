import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side client that reads/writes the auth session via cookies.
// Uses the publishable key — respects RLS, safe to use for auth checks.
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no request context to
            // write to — safe to ignore since the proxy refreshes sessions.
          }
        },
      },
    }
  );
}
