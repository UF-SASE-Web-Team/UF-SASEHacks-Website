"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRow = {
  user_id: string;
  status: string;
  editing_locked: boolean;
  resume_updated_at: string | null;
  profiles: {
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone_number: string | null;
    date_of_birth: string | null;
    age: string | null;
    linkedin_url: string | null;
    school: string | null;
    major: string | null;
    grad_year: string | null;
    level_of_study: string | null;
    engineering_skill: string | null;
    hackathon_experience: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    country: string | null;
    tshirt: string | null;
    gender: string | null;
    race: string[] | null;
  } | null;
};

// Fetch rows for the admin table with optional filters
export async function fetchAdminRows({
  q,
  status,
}: { q?: string; status?: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  // Enforce admin
  const { data: isAdmin } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (!isAdmin) return { ok: false, error: "Not admin" };

  let query = supabase
    .from("registrations")
    .select(
      "user_id, status, editing_locked, resume_updated_at, profiles(*)"
    )
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  // Simple "q" matches name or email
  if (q) {
    query = query.or(
      `profiles.full_name.ilike.%${q}%,profiles.email.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error) return { ok: false, error: error.message };

  return { ok: true, rows: (data ?? []) as unknown as AdminRow[] };
}

/** Single or bulk status update */
export async function setStatus(userIds: string[], status: "confirmed" | "waitlist" | "rejected" | "pending") {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (!isAdmin) return { ok: false, error: "Not admin" };

  if (!userIds.length) return { ok: false, error: "No users selected" };

  const { error } = await supabase
    .from("registrations")
    .update({ status })
    .in("user_id", userIds);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

/** Toggle lock (single or bulk) */
export async function setEditingLock(userIds: string[], locked: boolean) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (!isAdmin) return { ok: false, error: "Not admin" };

  if (!userIds.length) return { ok: false, error: "No users selected" };

  const { error } = await supabase
    .from("registrations")
    .update({ editing_locked: locked })
    .in("user_id", userIds);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

/** Generate short-lived signed resume URLs for selected users */
export async function getSignedResumeLinks(userIds: string[]) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (!isAdmin) return { ok: false, error: "Not admin" };

  const results: { user_id: string; url: string | null }[] = [];

  for (const uid of userIds) {
    const path = `${uid}/resume.pdf`;
    const { data, error } = await supabase.storage.from("resumes").createSignedUrl(path, 300);
    if (error || !data?.signedUrl) {
      results.push({ user_id: uid, url: null });
    } else {
      results.push({ user_id: uid, url: data.signedUrl });
    }
  }

  return { ok: true, links: results };
}

/** Delete profiles (also deletes associated registrations and resumes via cascade) */
export async function deleteProfiles(userIds: string[]) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (!isAdmin) return { ok: false, error: "Not admin" };

  if (!userIds.length) return { ok: false, error: "No users selected" };

  // Delete resumes from storage first
  for (const uid of userIds) {
    const path = `${uid}/resume.pdf`;
    // Ignore errors if file doesn't exist
    await supabase.storage.from("resumes").remove([path]);
  }

  // Delete registrations (profiles will cascade delete if configured, or delete manually)
  const { error: regError } = await supabase
    .from("registrations")
    .delete()
    .in("user_id", userIds);

  if (regError) return { ok: false, error: regError.message };

  // Delete profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .in("id", userIds);

  if (profileError) return { ok: false, error: profileError.message };

  revalidatePath("/admin");
  return { ok: true };
}

/** Get all resume URLs for download */
export async function getAllResumeLinks() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (!isAdmin) return { ok: false, error: "Not admin" };

  // Get all users who have uploaded resumes
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("user_id, profiles(full_name, email)")
    .eq('share_resume_with_companies', true)
    .not("resume_url", "is", null);

  if (error) return { ok: false, error: error.message };

  const results: { user_id: string; name: string | null; email: string | null; url: string | null }[] = [];

  for (const reg of registrations ?? []) {
    const path = `${reg.user_id}/resume.pdf`;
    const { data, error: urlError } = await supabase.storage.from("resumes").createSignedUrl(path, 3600); // 1 hour

    const profile = reg.profiles as unknown as { full_name: string | null; email: string | null } | null;

    if (urlError || !data?.signedUrl) {
      results.push({
        user_id: reg.user_id,
        name: profile?.full_name ?? null,
        email: profile?.email ?? null,
        url: null
      });
    } else {
      results.push({
        user_id: reg.user_id,
        name: profile?.full_name ?? null,
        email: profile?.email ?? null,
        url: data.signedUrl
      });
    }
  }

  return { ok: true, links: results };
}
