import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin, MEDIA_BUCKET } from "@/lib/supabaseAdmin";
import { sniffImageType, sniffPdfType } from "@/lib/fileType";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 10MB)." }, { status: 400 });
  }

  const kind = formData.get("kind") === "pdf" ? "pdf" : "image";

  const arrayBuffer = await file.arrayBuffer();

  // Never trust the client-supplied Content-Type header - verify the real
  // file content by its magic bytes instead. This also excludes SVG, which
  // can embed <script> and is a stored-XSS vector if served back to a browser.
  const sniffed = kind === "pdf" ? sniffPdfType(new Uint8Array(arrayBuffer)) : sniffImageType(new Uint8Array(arrayBuffer));
  if (!sniffed) {
    return NextResponse.json({ error: "Unsupported or invalid file type." }, { status: 400 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Media storage is not configured." }, { status: 500 });
  }

  // The storage path extension comes from the verified content type, never
  // from the user-supplied filename, so it can't be used to smuggle path
  // segments (e.g. a filename containing "../") into the storage key.
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${sniffed.ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(path, arrayBuffer, { contentType: sniffed.mime });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  const media = await prisma.media.create({
    data: {
      url: publicUrlData.publicUrl,
      path,
      filename: file.name,
      mimeType: sniffed.mime,
      size: file.size,
    },
  });

  return NextResponse.json({ id: media.id, url: media.url });
}
