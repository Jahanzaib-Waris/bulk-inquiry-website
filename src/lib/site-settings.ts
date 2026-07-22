import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SiteSettings } from "@/lib/types";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_name: "Bulk Inquiry",
  logo_url: null,
  updated_at: new Date(0).toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabaseAdmin()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return DEFAULT_SETTINGS;
  return data as SiteSettings;
}

export const SITE_ASSETS_BUCKET = "site-assets";
