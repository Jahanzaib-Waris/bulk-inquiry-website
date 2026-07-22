import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SITE_SETTINGS_TAG } from "@/lib/site-settings";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const siteName = String(body.site_name ?? "").trim();

  if (!siteName) {
    return NextResponse.json({ error: "Website name cannot be empty." }, { status: 400 });
  }
  if (siteName.length > 60) {
    return NextResponse.json({ error: "Website name is too long." }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from("site_settings")
    .update({ site_name: siteName, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(SITE_SETTINGS_TAG, { expire: 0 });
  return NextResponse.json({ ok: true });
}
