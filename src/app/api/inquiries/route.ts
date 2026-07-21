import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, INQUIRY_IMAGES_BUCKET } from "@/lib/supabase/admin";

const MAX_IMAGES = 10;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB per image
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const email = String(formData.get("email") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!description || description.length < 10) {
    return NextResponse.json(
      { error: "Please provide a description of at least 10 characters." },
      { status: 400 }
    );
  }
  if (files.length > MAX_IMAGES) {
    return NextResponse.json({ error: `You can upload at most ${MAX_IMAGES} images.` }, { status: 400 });
  }
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported image type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: `${file.name} exceeds the 8MB limit.` }, { status: 400 });
    }
  }

  const supabase = supabaseAdmin();
  const imageUrls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(INQUIRY_IMAGES_BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: publicUrl } = supabase.storage.from(INQUIRY_IMAGES_BUCKET).getPublicUrl(path);
    imageUrls.push(publicUrl.publicUrl);
  }

  const { error: insertError } = await supabase.from("inquiries").insert({
    email,
    description,
    image_urls: imageUrls,
  });

  if (insertError) {
    return NextResponse.json({ error: `Could not save inquiry: ${insertError.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
