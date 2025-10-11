"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const supabase = createSupabaseBrowserClient();
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/portal";
      }}
      className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border hover:bg-gray-50"
    >
      Sign out
    </button>
  );
}
