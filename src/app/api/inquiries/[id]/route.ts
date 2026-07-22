import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, INQUIRY_IMAGES_BUCKET } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const status = body.status;

  if (status !== "new" && status !== "reviewed") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabaseAdmin().from("inquiries").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = supabaseAdmin();

  const { data: inquiry, error: fetchError } = await admin
    .from("inquiries")
    .select("image_urls")
    .eq("id", id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const paths = (inquiry?.image_urls ?? []).map((url: string) => url.split(`${INQUIRY_IMAGES_BUCKET}/`).pop()!);
  if (paths.length > 0) {
    await admin.storage.from(INQUIRY_IMAGES_BUCKET).remove(paths);
  }

  const { error } = await admin.from("inquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
