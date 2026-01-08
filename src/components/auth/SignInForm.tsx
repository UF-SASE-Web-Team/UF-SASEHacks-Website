"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInForm({ next = "/portal" }: { next?: string }) {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState<"google" | "github" | "email" | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  async function signInWithProvider(provider: "google" | "github") {
    setErr(null);
    setLoading(provider);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Failed to sign in");
      setLoading(null);
    }
  }

  async function signInWithEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading("email");
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setEmailSent(true);
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Failed to send magic link");
    } finally {
      setLoading(null);
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-5">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="font-[family-name:var(--font-body)]">
              <p className="text-sm font-medium text-green-900 mb-1">Magic link sent!</p>
              <p className="text-sm text-green-700">
                Check your inbox for a magic link. Make sure to open it in the same browser.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEmailSent(false);
            setShowEmailForm(false);
            setEmail("");
          }}
          className="font-[family-name:var(--font-body)] text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to sign in options
        </button>
      </div>
    );
  }

  if (showEmailForm) {
    return (
      <div className="space-y-4">
        <form onSubmit={signInWithEmail} className="space-y-4">
          <label className="block">
            <span className="font-[family-name:var(--font-body)] text-sm font-medium text-gray-700 mb-2 block">
              Email Address
            </span>
            <input
              className="font-[family-name:var(--font-body)] w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#ff9b5e] focus:border-transparent hover:border-gray-400"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={loading === "email"}
            className="font-[family-name:var(--font-body)] w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#560700] to-[#6b1003] hover:from-[#6b1003] hover:to-[#560700] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "email" ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send Magic Link
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setShowEmailForm(false)}
          className="font-[family-name:var(--font-body)] text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to sign in options
        </button>
        {err && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-[family-name:var(--font-body)] text-sm text-red-700">{err}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => signInWithProvider("google")}
        disabled={loading !== null}
        className="font-[family-name:var(--font-body)] w-full inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "google" ? (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => signInWithProvider("github")}
        disabled={loading !== null}
        className="font-[family-name:var(--font-body)] w-full inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-[#24292e] hover:bg-[#1b1f23] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "github" ? (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        )}
        Continue with GitHub
      </button>

      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-gray-500 text-sm font-[family-name:var(--font-body)]">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <button
        type="button"
        onClick={() => setShowEmailForm(true)}
        disabled={loading !== null}
        className="font-[family-name:var(--font-body)] w-full inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Continue with Email
      </button>

      {err && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 mt-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-[family-name:var(--font-body)] text-sm text-red-700">{err}</p>
          </div>
        </div>
      )}
    </div>
  );
}
