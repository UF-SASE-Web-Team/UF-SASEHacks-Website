import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (!isAdmin) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const { data: registration } = await supabase
    .from("registrations")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    return <div className="mx-auto max-w-screen-lg px-4 py-10">User not found</div>;
  }

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-10">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back to Admin Panel
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-2">Profile: {profile.full_name}</h1>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm text-gray-600">User ID:</span>
        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{userId}</code>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-sm">{profile.full_name || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-sm">{profile.email || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <p className="text-sm">{profile.phone_number || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-sm">{profile.date_of_birth || "-"}</p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Education</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">School</label>
              <p className="text-sm">{profile.school || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Major</label>
              <p className="text-sm">{profile.major || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Graduation Year</label>
              <p className="text-sm">{profile.grad_year || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Level of Study</label>
              <p className="text-sm capitalize">{profile.level_of_study || "-"}</p>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Experience</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Engineering Skill Level</label>
              <p className="text-sm">{profile.engineering_skill ? `${profile.engineering_skill}/5` : "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Hackathon Experience</label>
              <p className="text-sm">{profile.hackathon_experience || "-"} hackathons attended</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Address Line 1</label>
              <p className="text-sm">{profile.address_line1 || "-"}</p>
            </div>
            {profile.address_line2 && (
              <div>
                <label className="text-sm font-medium text-gray-600">Address Line 2</label>
                <p className="text-sm">{profile.address_line2}</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-sm">{profile.city || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State</label>
                <p className="text-sm">{profile.state || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Zip Code</label>
                <p className="text-sm">{profile.zip_code || "-"}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Country</label>
              <p className="text-sm">{profile.country || "-"}</p>
            </div>
          </div>
        </div>

        {/* Event Preferences */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Event Preferences</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">T-shirt Size</label>
              <p className="text-sm">{profile.tshirt || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Dietary Restrictions</label>
              <p className="text-sm capitalize">
                {profile.dietary && Array.isArray(profile.dietary) && profile.dietary.length > 0
                  ? profile.dietary.join(", ")
                  : "None"}
              </p>
            </div>
            {profile.accessibility && (
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-600">Accessibility Needs</label>
                <p className="text-sm">{profile.accessibility}</p>
              </div>
            )}
          </div>
        </div>

        {/* Demographics */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Demographics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <p className="text-sm capitalize">{profile.gender?.split("-").join(" ") || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Race</label>
              <p className="text-sm capitalize">
                {profile.race && Array.isArray(profile.race) && profile.race.length > 0
                  ? profile.race.map((r: string) => r.split("-").join(" ")).join(", ")
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Registration Status */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Registration Status</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-sm">
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                  {registration?.status || "pending"}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Editing Locked</label>
              <p className="text-sm">{registration?.editing_locked ? "Yes" : "No"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Resume Uploaded</label>
              <p className="text-sm">{registration?.resume_url ? "Yes" : "No"}</p>
            </div>
            {registration?.resume_updated_at && (
              <div>
                <label className="text-sm font-medium text-gray-600">Resume Updated</label>
                <p className="text-sm">{new Date(registration.resume_updated_at).toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-semibold mb-2">Consent Agreements</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={registration?.accuracy_agreement ? "text-green-600" : "text-red-600"}>
                  {registration?.accuracy_agreement ? "✓" : "✗"}
                </span>
                <span>Accuracy Agreement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={registration?.terms_and_conditions ? "text-green-600" : "text-red-600"}>
                  {registration?.terms_and_conditions ? "✓" : "✗"}
                </span>
                <span>Terms and Conditions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={registration?.code_of_conduct ? "text-green-600" : "text-red-600"}>
                  {registration?.code_of_conduct ? "✓" : "✗"}
                </span>
                <span>Code of Conduct</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={registration?.can_photograph ? "text-green-600" : "text-gray-400"}>
                  {registration?.can_photograph ? "✓" : "✗"}
                </span>
                <span>Photography Consent (optional)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
