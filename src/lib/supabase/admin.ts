import { createClient } from "@supabase/supabase-js";

// Server-only client using the secret key. Never import this from
// client components — it bypasses Row Level Security entirely. Used only
// for the inquiries table and storage, not for auth.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY env vars"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export const INQUIRY_IMAGES_BUCKET = "inquiry-images";
