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
  hackathonExperienceOptions,
  raceOptions,
} from "@/lib/validation";

type Props = {
  initialValues: ProfileFormValues;
  initialConsents?: {
    accuracy_agreement: boolean;
    terms_and_conditions: boolean;
    code_of_conduct: boolean;
    can_photograph: boolean;
    share_resume_with_companies: boolean;
  };
  action: (state: unknown, formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  disabled?: boolean;
};

export default function ProfileForm({ initialValues, initialConsents, action, disabled }: Props) {
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const submit = async (data: ProfileFormValues) => {
    setServerMsg(null);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(item => fd.append(k, item));
      } else {
        fd.append(k, String(v ?? ""));
      }
    });

    // Add consent checkboxes to FormData (they're not part of the react-hook-form)
    if (initialConsents) {
      const accuracyCheckbox = document.querySelector('input[name="accuracy_agreement"]') as HTMLInputElement;
      const termsCheckbox = document.querySelector('input[name="terms_and_conditions"]') as HTMLInputElement;
      const codeCheckbox = document.querySelector('input[name="code_of_conduct"]') as HTMLInputElement;
      const photoCheckbox = document.querySelector('input[name="can_photograph"]') as HTMLInputElement;
      const resumeCheckbox = document.querySelector('input[name="share_resume_with_companies"]') as HTMLInputElement;

      if (accuracyCheckbox?.checked) fd.append("accuracy_agreement", "on");
      if (termsCheckbox?.checked) fd.append("terms_and_conditions", "on");
      if (codeCheckbox?.checked) fd.append("code_of_conduct", "on");
      if (photoCheckbox?.checked) fd.append("can_photograph", "on");
      if (resumeCheckbox?.checked) fd.append("share_resume_with_companies", "on");
    }

    const result = await action(undefined, fd);
    if (result.ok) setServerMsg("Saved!");
    else setServerMsg(result.error ?? "Save failed");
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      {/* Personal Information */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#560700] to-[#ff9b5e] opacity-10 blur-xl"></div>
        <div className="relative bg-white rounded-3xl shadow-xl border border-[#FFE4B3]/30 p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[#560700] mb-4">Personal Information</h2>
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
            <span className="text-sm font-medium">Email *</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-gray-100"
              readOnly
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.email.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Phone Number *</span>
            <input
              type="tel"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
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
      </div>

      {/* Education */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#BFDCFF] to-[#D0FFCB] opacity-20 blur-xl"></div>
        <div className="relative bg-white rounded-3xl shadow-xl border border-[#FFE4B3]/30 p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[#560700] mb-4">Education</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">School *</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
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
              {...form.register("major")}
            />
            {form.formState.errors.major && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.major.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Expected Graduation Year *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("grad_year")}
            >
              {gradYearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {form.formState.errors.grad_year && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.grad_year.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Level of Study *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("level_of_study")}
            >
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
            </select>
            {form.formState.errors.level_of_study && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.level_of_study.message}</p>
            )}
          </label>
        </div>
        </div>
      </div>

      {/* Experience */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#FFC7E5] to-[#E6D4FF] opacity-20 blur-xl"></div>
        <div className="relative bg-white rounded-3xl shadow-xl border border-[#FFE4B3]/30 p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[#560700] mb-4">Experience</h2>
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
              <option value="3">3 - Somewhat Learning</option>
              <option value="4">4 - Experienced</option>
              <option value="5">5 - Very Experienced</option>
            </select>
            {form.formState.errors.engineering_skill && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.engineering_skill.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Number of Hackathons Attended *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("hackathon_experience")}
            >
              {hackathonExperienceOptions.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {form.formState.errors.hackathon_experience && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.hackathon_experience.message}</p>
            )}
          </label>
        </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#560700] to-[#ff9b5e] opacity-10 blur-xl"></div>
        <div className="relative bg-white rounded-3xl shadow-xl border border-[#FFE4B3]/30 p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[#560700] mb-4">Contact Information</h2>
        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm font-medium">Address Line 1 *</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("address_line1")}
            />
            {form.formState.errors.address_line1 && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.address_line1.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Address Line 2</span>
            <input
              placeholder="Apt, suite, etc (optional)"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
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
              {...form.register("country")}
            />
            {form.formState.errors.country && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.country.message}</p>
            )}
          </label>
        </div>
        </div>
      </div>

      {/* Event Preferences */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#BFDCFF] to-[#D0FFCB] opacity-20 blur-xl"></div>
        <div className="relative bg-white rounded-3xl shadow-xl border border-[#FFE4B3]/30 p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[#560700] mb-4">Event Preferences</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">T-shirt Size *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("tshirt")}
            >
              {tshirtOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {form.formState.errors.tshirt && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.tshirt.message}</p>
            )}
          </label>
        </div>

        <label className="block mt-4">
          <span className="text-sm font-medium">Dietary Restrictions (select all that apply)</span>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {dietaryOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={opt}
                  disabled={disabled}
                  defaultChecked={initialValues.dietary.includes(opt)}
                  {...form.register("dietary")}
                />
                <span className="capitalize">{opt.replace("-", " ")}</span>
              </label>
            ))}
          </div>
          {form.formState.errors.dietary && (
            <p className="text-xs text-red-600 mt-1">{form.formState.errors.dietary.message as string}</p>
          )}
        </label>

        <label className="block mt-4">
          <span className="text-sm font-medium">Accessibility Needs</span>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
            disabled={disabled}
            {...form.register("accessibility")}
          />
        </label>
        </div>
      </div>

      {/* Demographics */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#FFC7E5] to-[#E6D4FF] opacity-20 blur-xl"></div>
        <div className="relative bg-white rounded-3xl shadow-xl border border-[#FFE4B3]/30 p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[#560700] mb-4">Demographics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Gender *</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={disabled}
              {...form.register("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {form.formState.errors.gender && (
              <p className="text-xs text-red-600 mt-1">{form.formState.errors.gender.message}</p>
            )}
          </label>
        </div>

        <label className="block mt-4">
          <span className="text-sm font-medium">Race (select all that apply) *</span>
          <div className="mt-2 grid gap-2">
            {raceOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={opt}
                  disabled={disabled}
                  defaultChecked={initialValues.race.includes(opt)}
                  {...form.register("race")}
                />
                <span className="capitalize">{opt.split("-").join(" ")}</span>
              </label>
            ))}
          </div>
          {form.formState.errors.race && (
            <p className="text-xs text-red-600 mt-1">{form.formState.errors.race.message as string}</p>
          )}
        </label>
        </div>
      </div>

      {/* Consents - only show if initialConsents is provided */}
      {initialConsents && (
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#560700] to-[#ff9b5e] opacity-10 blur-xl"></div>
          <div className="relative bg-white rounded-3xl shadow-xl border border-[#FFE4B3]/30 p-6 md:p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[#560700] mb-4">Consents</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="accuracy_agreement"
                defaultChecked={initialConsents.accuracy_agreement}
                disabled={disabled}
                className="mt-0.5"
              />
              <span>
                I have filled out this application to the best of my knowledge and that I have not provided false, inaccurate, or misleading information. *
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="terms_and_conditions"
                defaultChecked={initialConsents.terms_and_conditions}
                disabled={disabled}
                className="mt-0.5"
              />
              <span>
                I have read and agreed to the UF SASE Hacks Privacy Policy and the UF SASE Hacks Terms and Conditions *
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="code_of_conduct"
                defaultChecked={initialConsents.code_of_conduct}
                disabled={disabled}
                className="mt-0.5"
              />
              <span>
                I have read and agreed to the UF SASE Hacks Code of Conduct *
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="can_photograph"
                defaultChecked={initialConsents.can_photograph}
                disabled={disabled}
                className="mt-0.5"
              />
              <span>
                I consent to photography at the event (optional)
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="share_resume_with_companies"
                defaultChecked={initialConsents.share_resume_with_companies}
                disabled={disabled}
                className="mt-0.5"
              />
              <span>
                I consent to having my resume shared with participating companies for recruitment purposes (optional)
              </span>
            </label>
          </div>
        </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={disabled || form.formState.isSubmitting}
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border bg-black text-white border-black hover:opacity-90 disabled:opacity-50"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save profile"}
        </button>
        {serverMsg && <span className="text-sm text-gray-700">{serverMsg}</span>}
      </div>
    </form>
  );
}
