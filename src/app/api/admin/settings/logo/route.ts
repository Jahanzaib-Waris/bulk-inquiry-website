import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SITE_ASSETS_BUCKET, SITE_SETTINGS_TAG } from "@/lib/site-settings";
import { requireAdmin } from "@/lib/require-admin";

const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("logo");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No logo file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported image type: ${file.type}` }, { status: 400 });
  }
  if (file.size > MAX_LOGO_BYTES) {
    return NextResponse.json({ error: "Logo must be under 2MB." }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const ext = file.name.split(".").pop() || "png";
  const path = `logo-${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(SITE_ASSETS_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  const { data: publicUrl } = admin.storage.from(SITE_ASSETS_BUCKET).getPublicUrl(path);

  const { error: updateError } = await admin
    .from("site_settings")
    .update({ logo_url: publicUrl.publicUrl, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  revalidateTag(SITE_SETTINGS_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, logo_url: publicUrl.publicUrl });
}
