import { ensureRows, upsertProfileAndConsents } from "../actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/forms/ProfileForm";
import { dietaryOptions, raceOptions } from "@/lib/validation";

export default async function ProfilePage() {
  await ensureRows();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: registration } = await supabase
    .from("registrations")
    .select("editing_locked, accuracy_agreement, terms_and_conditions, code_of_conduct, can_photograph")
    .eq("user_id", user.id)
    .single();

  const disabled = registration?.editing_locked ?? false;

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-10">
      <h1 className="text-2xl font-semibold">Your Profile</h1>
      {disabled && (
        <div className="mt-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm">
          Editing is currently locked by admins. You can still view your info.
        </div>
      )}
      <div className="mt-6">
        <ProfileForm
          initialValues={{
            full_name: profile?.full_name ?? "",
            email: profile?.email ?? user.email ?? "",
            phone_number: profile?.phone_number ?? "",
            date_of_birth: profile?.date_of_birth ?? "",
            school: profile?.school ?? "",
            major: profile?.major ?? "",
            grad_year: profile?.grad_year ?? "2026",
            level_of_study: profile?.level_of_study ?? "undergraduate",
            engineering_skill: profile?.engineering_skill ?? "3",
            hackathon_experience: profile?.hackathon_experience ?? "0",
            address_line1: profile?.address_line1 ?? "",
            address_line2: profile?.address_line2 ?? "",
            city: profile?.city ?? "",
            state: profile?.state ?? "",
            zip_code: profile?.zip_code ?? "",
            country: profile?.country ?? "",
            tshirt: profile?.tshirt ?? "M",
            dietary: Array.isArray(profile?.dietary)
              ? profile.dietary.filter((d: unknown): d is typeof dietaryOptions[number] =>
                  typeof d === 'string' && dietaryOptions.includes(d as typeof dietaryOptions[number])
                )
              : [],
            accessibility: profile?.accessibility ?? "",
            gender: profile?.gender ?? "prefer-not-to-say",
            race: Array.isArray(profile?.race)
              ? profile.race.filter((r: unknown): r is typeof raceOptions[number] =>
                  typeof r === 'string' && raceOptions.includes(r as typeof raceOptions[number])
                )
              : [],
          }}
          initialConsents={{
            accuracy_agreement: !!registration?.accuracy_agreement,
            terms_and_conditions: !!registration?.terms_and_conditions,
            code_of_conduct: !!registration?.code_of_conduct,
            can_photograph: !!registration?.can_photograph,
          }}
          action={upsertProfileAndConsents}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
