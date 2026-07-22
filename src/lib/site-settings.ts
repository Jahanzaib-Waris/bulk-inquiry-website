import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SiteSettings } from "@/lib/types";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_name: "Bulk Inquiry",
  logo_url: null,
  updated_at: new Date(0).toISOString(),
};

export const SITE_SETTINGS_TAG = "site-settings";

async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabaseAdmin()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return DEFAULT_SETTINGS;
  return data as SiteSettings;
}

// Branding rarely changes, so every page/layout render doesn't need a fresh
// round-trip to Supabase — cache it and invalidate on write instead.
export const getSiteSettings = unstable_cache(fetchSiteSettings, ["site-settings"], {
  tags: [SITE_SETTINGS_TAG],
  revalidate: 300,
});

export const SITE_ASSETS_BUCKET = "site-assets";
