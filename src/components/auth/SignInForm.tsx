"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInForm({ next = "/portal" }: { next?: string }) {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const origin = window.location.origin;
        setRedirectTo(`${origin}/auth/callback?next=${encodeURIComponent(next)}`);
    }
  }, [next]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Failed to send magic link");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border p-4 text-sm">
        Check your inbox for a magic link. After clicking it, you will ll be redirected.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-sm">
      <label className="block">
        <span className="text-sm">Email</span>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>
      <button
        type="submit"
        disabled={loading || !redirectTo}
        className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border bg-black text-white border-black hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send magic link"}
      </button>
      {err && <div className="text-sm text-red-600">{err}</div>}
    </form>
  );
}