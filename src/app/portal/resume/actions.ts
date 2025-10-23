"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// denotes 10 MB
const MAX_BYTES = 10 * 1024 * 1024;

// Checks to see if it is pdf
function looksLikePdf(bytes: Uint8Array) {
  if (bytes.length < 5) return false;
  return (
    bytes[0] === 0x25 && // %
    bytes[1] === 0x50 && // P
    bytes[2] === 0x44 && // D
    bytes[3] === 0x46 && // F
    bytes[4] === 0x2D    // -
  );
}

export async function uploadResume(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const file = formData.get("resume") as File | null;
  if (!file) return { ok: false, error: "No file provided" };

  // Basic validations
  if (file.size === 0) return { ok: false, error: "Empty file" };
  if (file.size > MAX_BYTES) return { ok: false, error: "File too large (max 10 MB)" };

  const type = file.type?.toLowerCase() || "";
  if (type && type !== "application/pdf") {
    return { ok: false, error: "Only PDF files are allowed" };
  }

  // Inspect magic header
  const buf = new Uint8Array(await file.arrayBuffer());
  if (!looksLikePdf(buf)) {
    return { ok: false, error: "Invalid PDF file (failed signature check)" };
  }

  const path = `${user.id}/resume.pdf`;
  const bucket = supabase.storage.from("resumes");

  // Upload
  const { error: uploadErr } = await bucket.upload(path, buf, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (uploadErr) return { ok: false, error: uploadErr.message };

  // Update DB record
  const { error: updErr } = await supabase
    .from("registrations")
    .update({
      resume_url: path,
      resume_updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (updErr) return { ok: false, error: updErr.message };

  revalidatePath("/portal/resume");
  revalidatePath("/portal");

  redirect("/portal");
}

// Preview resume link
export async function getSignedResumeUrl() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { url: null };

  // Look up the stored path
  const { data: reg } = await supabase
    .from("registrations")
    .select("resume_url")
    .eq("user_id", user.id)
    .single();

  if (!reg?.resume_url) return { url: null };

  const { data, error } = await supabase.storage.from("resumes").createSignedUrl(reg.resume_url, 60); // 60s
  if (error || !data?.signedUrl) return { url: null };

  return { url: data.signedUrl };
}
