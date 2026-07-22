import { supabaseServer } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
