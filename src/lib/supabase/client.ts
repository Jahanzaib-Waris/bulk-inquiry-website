import { createBrowserClient } from "@supabase/ssr";

// Browser client for auth (sign in/out) using the publishable key.
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
