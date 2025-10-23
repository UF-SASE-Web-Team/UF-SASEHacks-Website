import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/forms/OnboardingForm";
import { upsertProfile, saveRegistrationFlags, uploadResumeOnboarding } from "../actions";

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: reg } = await supabase
    .from("registrations")
    .select("accuracy_agreement, terms_and_conditions, code_of_conduct, can_photograph, editing_locked")
    .eq("user_id", user.id)
    .single();

  // If profile is complete (has name and school), redirect to portal
  if (profile?.full_name && profile?.school) {
    redirect("/portal");
  }

  const locked = reg?.editing_locked ?? false;

  return (
    <div className="mx-auto max-w-screen-md px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Complete Your Registration</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome! Please complete your profile to finish registration for UF SASE Hacks.
        </p>
      </div>

      <OnboardingForm
        initialProfile={{
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
          dietary: profile?.dietary ?? [],
          accessibility: profile?.accessibility ?? "",

          gender: profile?.gender ?? "prefer-not-to-say",
          race: profile?.race ?? [],
        }}
        initialConsents={{
          accuracy_agreement: reg?.accuracy_agreement ?? false,
          terms_and_conditions: reg?.terms_and_conditions ?? false,
          code_of_conduct: reg?.code_of_conduct ?? false,
          can_photograph: reg?.can_photograph ?? false,
        }}
        profileAction={upsertProfile}
        consentAction={saveRegistrationFlags}
        resumeAction={uploadResumeOnboarding}
        disabled={locked}
      />
    </div>
  );
}
