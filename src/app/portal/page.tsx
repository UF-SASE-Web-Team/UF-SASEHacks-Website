import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureRows } from "./actions";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function PortalPage() {
  await ensureRows();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, school")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  // Redirect to onboarding if profile is incomplete
  if (!profile?.full_name || !profile?.school) {
    redirect("/portal/onboarding");
  }

  const { data: reg } = await supabase
    .from("registrations")
    .select("status, editing_locked, resume_url, resume_updated_at")
    .eq("user_id", user?.id ?? "")
    .single();

  const locked = reg?.editing_locked ?? false;

  return (
    <div className="mx-auto max-w-screen-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {locked && (
        <div className="mt-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm">
          Editing is locked. You can still view your info and resume timestamp.
        </div>
      )}

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="font-medium mb-2">Status</h2>
        <div className="text-sm text-gray-700">
          Hello{profile?.full_name ? `, ${profile.full_name}` : ""}. Your status is{" "}
          <span className="font-medium">{reg?.status ?? "pending"}</span>.
        </div>
        <div className="mt-3 flex gap-2">
          <Link href="/portal/profile" className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border hover:bg-gray-50">
            Edit profile
          </Link>
          <Link href="/portal/resume" className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border hover:bg-gray-50">
            {reg?.resume_url ? "Replace resume" : "Upload resume"}
          </Link>
        </div>
        {reg?.resume_updated_at && (
          <div className="mt-2 text-xs text-gray-500">
            Resume last updated: {new Date(reg.resume_updated_at).toLocaleString()}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="font-medium mb-2">Links</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="{{https://discord.gg/...}}"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-gray-900 underline decoration-gray-400 hover:decoration-gray-900 transition-colors"
            >
              Discord
            </a>
          </li>
          <li>
            <a
              href="{{https://hackathon.devpost.com}}"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-gray-900 underline decoration-gray-400 hover:decoration-gray-900 transition-colors"
            >
              Devpost
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
