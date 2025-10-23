"use server";

import { revalidatePath } from "next/cache";
import { profileSchema, registrationFlagsSchema } from "@/lib/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function ensureRows() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "not_authenticated" };

  // profiles
  const { data: prof } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!prof) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: "",
      school: "",
      major: "",
      tshirt: "M",
      dietary: [],
      accessibility: "",
      country: "",
    });
  }

  // registrations
  const { data: reg } = await supabase
    .from("registrations")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!reg) {
    await supabase.from("registrations").insert({ user_id: user.id });
  }

  return { ok: true };
}

export async function upsertProfile(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const values = {
    full_name: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone_number: String(formData.get("phone_number") ?? ""),
    date_of_birth: String(formData.get("date_of_birth") ?? ""),

    school: String(formData.get("school") ?? ""),
    major: String(formData.get("major") ?? ""),
    grad_year: String(formData.get("grad_year") ?? "2026"),
    level_of_study: String(formData.get("level_of_study") ?? "undergraduate"),

    engineering_skill: String(formData.get("engineering_skill") ?? "3"),
    hackathon_experience: String(formData.get("hackathon_experience") ?? "0"),

    address_line1: String(formData.get("address_line1") ?? ""),
    address_line2: String(formData.get("address_line2") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    zip_code: String(formData.get("zip_code") ?? ""),
    country: String(formData.get("country") ?? ""),

    tshirt: String(formData.get("tshirt") ?? "M"),
    dietary: Array.from(formData.getAll("dietary")).map(String),
    accessibility: String(formData.get("accessibility") ?? ""),

    gender: String(formData.get("gender") ?? "prefer-not-to-say"),
    race: Array.from(formData.getAll("race")).map(String),
  };

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") || "Validation failed" };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...parsed.data }, { onConflict: "id" });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/portal/profile");
  revalidatePath("/portal");
  return { ok: true };
}

export async function saveRegistrationFlags(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const values = {
    accuracy_agreement: formData.get("accuracy_agreement") === "on",
    terms_and_conditions: formData.get("terms_and_conditions") === "on",
    code_of_conduct: formData.get("code_of_conduct") === "on",
    can_photograph: formData.get("can_photograph") === "on",
  };
  const parsed = registrationFlagsSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "You must accept all required agreements" };
  }

  // Editing locking based on RLS
  const { error } = await supabase
    .from("registrations")
    .update(parsed.data)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/portal");
  return { ok: true };
}

/** Combined action to save both profile and consents */
export async function upsertProfileAndConsents(_: unknown, formData: FormData) {
  // First update profile
  const profileResult = await upsertProfile(_, formData);
  if (!profileResult.ok) {
    return profileResult;
  }

  // Then update consents
  const consentsResult = await saveRegistrationFlags(_, formData);
  if (!consentsResult.ok) {
    return consentsResult;
  }

  return { ok: true };
}

/** 10 MB */
const MAX_BYTES = 10 * 1024 * 1024;

/** Cheap PDF signature check: first 5 bytes should be "%PDF-" */
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

export async function uploadResumeOnboarding(formData: FormData) {
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

  // Upload (upsert)
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
  return { ok: true };
}
