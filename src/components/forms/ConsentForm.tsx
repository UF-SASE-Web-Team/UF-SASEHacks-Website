"use client";

import { useState } from "react";

type Props = {
  waiverAccepted: boolean;
  canPhotograph: boolean;
  locked: boolean;
  action: (state: unknown, formData: FormData) => Promise<{ ok: boolean; error?: string }>;
};

export default function ConsentForm({ waiverAccepted, canPhotograph, locked, action }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await action(undefined, formData);

    setIsSubmitting(false);
    if (result.ok) {
      setMessage("Saved!");
    } else {
      setMessage(result.error ?? "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-4">
      <h2 className="font-medium mb-2">Consents</h2>
      <div className="mt-2 flex flex-col gap-2 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="waiver_accepted"
            defaultChecked={waiverAccepted}
            disabled={locked}
          />
          <span>I accept the event waiver.</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="can_photograph"
            defaultChecked={canPhotograph}
            disabled={locked}
          />
          <span>I consent to photography at the event.</span>
        </label>
      </div>
      <button
        type="submit"
        disabled={locked || isSubmitting}
        className="mt-3 inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border bg-black text-white border-black hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save consents"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </form>
  );
}
