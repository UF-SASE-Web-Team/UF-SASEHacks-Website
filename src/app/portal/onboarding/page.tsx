import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/forms/OnboardingForm";
import { upsertProfile, saveRegistrationFlags, uploadResumeOnboarding } from "../actions";
import { HACK_NAME } from "@/lib/constants";

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
    .select("accuracy_agreement, terms_and_conditions, code_of_conduct, can_photograph, editing_locked, share_resume_with_companies")
    .eq("user_id", user.id)
    .single();

  // If profile is complete (has name and school), redirect to portal
  if (profile?.full_name && profile?.school) {
    redirect("/portal");
  }

  const locked = reg?.editing_locked ?? false;

  return (
    <div className="min-h-screen bg-[#FFE4B3] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#ebb8ce] opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#ebb8ce] opacity-20 rounded-full blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-screen-lg px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl text-[#560700] mb-4">
            Complete Registration
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-[#560700]/70 max-w-2xl mx-auto">
            Welcome to {HACK_NAME}! Please complete your profile to finish your registration.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#560700]/10 border border-[#560700]/20">
              <svg className="w-5 h-5 text-[#560700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-[family-name:var(--font-body)] text-sm text-[#560700]">All fields marked with * are required</span>
            </div>
          </div>
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
          share_resume_with_companies: reg?.share_resume_with_companies ?? false,
        }}
        profileAction={upsertProfile}
        consentAction={saveRegistrationFlags}
        resumeAction={uploadResumeOnboarding}
        disabled={locked}
      />
      </div>
    </div>
  );
}
