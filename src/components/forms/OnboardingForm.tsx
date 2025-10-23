"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  type ProfileFormValues,
  tshirtOptions,
  dietaryOptions,
  gradYearOptions,
  levelOfStudyOptions,
  hackathonExperienceOptions,
  genderOptions,
  raceOptions,
} from "@/lib/validation";
import { useRouter } from "next/navigation";

type Props = {
  initialProfile: ProfileFormValues;
  initialConsents: {
    accuracy_agreement: boolean;
    terms_and_conditions: boolean;
    code_of_conduct: boolean;
    can_photograph: boolean;
  };
  profileAction: (state: unknown, formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  consentAction: (state: unknown, formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  resumeAction: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  disabled?: boolean;
};

export default function OnboardingForm({
  initialProfile,
  initialConsents,
  profileAction,
  consentAction,
  resumeAction,
  disabled
}: Props) {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accuracyAgreement, setAccuracyAgreement] = useState(initialConsents.accuracy_agreement);
  const [termsAndConditions, setTermsAndConditions] = useState(initialConsents.terms_and_conditions);
  const [codeOfConduct, setCodeOfConduct] = useState(initialConsents.code_of_conduct);
  const [canPhotograph, setCanPhotograph] = useState(initialConsents.can_photograph);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfile,
    mode: "onBlur",
  });

  const submit = async (data: ProfileFormValues) => {
    setServerMsg(null);
    setIsSubmitting(true);

    // Validate required consents
    if (!accuracyAgreement || !termsAndConditions || !codeOfConduct) {
      setServerMsg("You must accept all required agreements to continue.");
      setIsSubmitting(false);
      return;
    }

    // Validate resume
    if (!resumeFile) {
      setServerMsg("You must upload a resume to continue.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Save profile
      const profileFd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach(item => profileFd.append(k, item));
        } else {
          profileFd.append(k, String(v ?? ""));
        }
      });

      const profileResult = await profileAction(undefined, profileFd);
      if (!profileResult.ok) {
        setServerMsg(profileResult.error ?? "Failed to save profile");
        setIsSubmitting(false);
        return;
      }

      // Save consents
      const consentFd = new FormData();
      if (accuracyAgreement) consentFd.append("accuracy_agreement", "on");
      if (termsAndConditions) consentFd.append("terms_and_conditions", "on");
      if (codeOfConduct) consentFd.append("code_of_conduct", "on");
      if (canPhotograph) consentFd.append("can_photograph", "on");

      const consentResult = await consentAction(undefined, consentFd);
      if (!consentResult.ok) {
        setServerMsg(consentResult.error ?? "Failed to save consents");
        setIsSubmitting(false);
        return;
      }

      // Upload resume
      const resumeFd = new FormData();
      resumeFd.append("resume", resumeFile);

      const resumeResult = await resumeAction(resumeFd);
      if (!resumeResult.ok) {
        setServerMsg(resumeResult.error ?? "Failed to upload resume");
        setIsSubmitting(false);
        return;
      }

      // Success! Redirect to portal
      router.push("/portal");
    } catch {
      setServerMsg("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      {/* Personal Information */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Personal Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Full name *</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("full_name")}
            />
            {form.formState.errors.full_name && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.full_name.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-gray-100"
              readOnly
              {...form.register("email")}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Phone Number *</span>
            <input
              type="tel"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              placeholder="(555) 123-4567"
              {...form.register("phone_number")}
            />
            {form.formState.errors.phone_number && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.phone_number.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Date of Birth *</span>
            <input
              type="date"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("date_of_birth")}
            />
            {form.formState.errors.date_of_birth && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.date_of_birth.message}</p>
            )}
          </label>
        </div>
      </div>

      {/* Education */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Education</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">School *</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              placeholder="e.g., University of Florida"
              {...form.register("school")}
            />
            {form.formState.errors.school && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.school.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Major / Field *</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              placeholder="e.g., Computer Science"
              {...form.register("major")}
            />
            {form.formState.errors.major && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.major.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Graduation Year *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("grad_year")}
            >
              {gradYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Level of Study *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("level_of_study")}
            >
              {levelOfStudyOptions.map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Experience */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Experience</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Engineering Skill Level *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("engineering_skill")}
            >
              <option value="1">1 - Beginning</option>
              <option value="2">2 - Learning</option>
              <option value="3">3 - Somewhat Experienced</option>
              <option value="4">4 - Experienced</option>
              <option value="5">5 - Very Experienced</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Hackathon Experience *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("hackathon_experience")}
            >
              <option value="">Number of hackathons attended</option>
              {hackathonExperienceOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Contact Information</h2>

        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm font-medium">Address Line 1 *</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              placeholder="Street address"
              {...form.register("address_line1")}
            />
            {form.formState.errors.address_line1 && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.address_line1.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Address Line 2</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              placeholder="Apt, suite, etc (optional)"
              {...form.register("address_line2")}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium">City *</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                disabled={disabled}
                {...form.register("city")}
              />
              {form.formState.errors.city && (
                <p className="text-xs text-red-600 mt-1">{form.formState.errors.city.message}</p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium">State *</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                disabled={disabled}
                {...form.register("state")}
              />
              {form.formState.errors.state && (
                <p className="text-xs text-red-600 mt-1">{form.formState.errors.state.message}</p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Zip Code *</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                disabled={disabled}
                {...form.register("zip_code")}
              />
              {form.formState.errors.zip_code && (
                <p className="text-xs text-red-600 mt-1">{form.formState.errors.zip_code.message}</p>
              )}
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Country *</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              placeholder="e.g., United States"
              {...form.register("country")}
            />
            {form.formState.errors.country && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.country.message}</p>
            )}
          </label>
        </div>
      </div>

      {/* Event Preferences */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Event Preferences</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">T-shirt size *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("tshirt")}
            >
              {tshirtOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Dietary restrictions</span>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {dietaryOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={opt}
                  disabled={disabled}
                  defaultChecked={initialProfile.dietary.includes(opt)}
                  {...form.register("dietary")}
                />
                <span className="capitalize">{opt.replace("-", " ")}</span>
              </label>
            ))}
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Accessibility needs (optional)</span>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
            disabled={disabled}
            placeholder="Let us know if you need any accommodations"
            {...form.register("accessibility")}
          />
        </label>
      </div>

      {/* Resume Upload */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Resume Upload</h2>

        <div>
          <label className="block">
            <span className="text-sm font-medium">Upload your resume (PDF only) *</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
              disabled={disabled}
              className="mt-2 block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border file:border-gray-300
                file:text-sm file:font-medium
                file:bg-white file:text-gray-700
                hover:file:bg-gray-50
                file:cursor-pointer cursor-pointer"
            />
          </label>
          {resumeFile && (
            <p className="mt-2 text-xs text-green-600">
              Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Maximum file size: 10 MB
          </p>
        </div>
      </div>

      {/* Demographics */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Demographics</h2>

        <label className="block">
          <span className="text-sm font-medium">Gender *</span>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            disabled={disabled}
            {...form.register("gender")}
          >
            {genderOptions.map(g => (
              <option key={g} value={g}>
                {g.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Race (select all that apply) *</span>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {raceOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={opt}
                  disabled={disabled}
                  defaultChecked={initialProfile.race.includes(opt)}
                  {...form.register("race")}
                />
                <span className="capitalize">{opt.split("-").join(" ")}</span>
              </label>
            ))}
          </div>
        </label>
      </div>

      {/* Final Steps */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Final Steps</h2>

        <div className="space-y-3">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={accuracyAgreement}
              onChange={(e) => setAccuracyAgreement(e.target.checked)}
              disabled={disabled}
              className="mt-1"
            />
            <span className="text-sm">
              <span className="font-medium">Accuracy Agreement *</span>
              <span className="block text-gray-600 mt-1">
                I have filled out this application to the best of my knowledge and that I have not provided false, inaccurate, or misleading information.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.checked)}
              disabled={disabled}
              className="mt-1"
            />
            <span className="text-sm">
              <span className="font-medium">Terms and Conditions *</span>
              <span className="block text-gray-600 mt-1">
                I have read and agreed to the UF SASE Hacks Privacy Policy and the UF SASE Hacks Terms and Conditions.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={codeOfConduct}
              onChange={(e) => setCodeOfConduct(e.target.checked)}
              disabled={disabled}
              className="mt-1"
            />
            <span className="text-sm">
              <span className="font-medium">Code of Conduct *</span>
              <span className="block text-gray-600 mt-1">
                I have read and agreed to the UF SASE Hacks Code of Conduct.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={canPhotograph}
              onChange={(e) => setCanPhotograph(e.target.checked)}
              disabled={disabled}
              className="mt-1"
            />
            <span className="text-sm">
              <span className="font-medium">Photography Consent (optional)</span>
              <span className="block text-gray-600 mt-1">
                I consent to being photographed or recorded during the event for promotional purposes.
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium border bg-black text-white border-black hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Complete Registration"}
        </button>
        {serverMsg && <span className="text-sm text-red-600">{serverMsg}</span>}
      </div>
    </form>
  );
}
