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
      className="px-5 py-1.5 rounded-full text-xs font-black border border-[#560700] text-[#560700] hover:bg-[#560700] hover:text-[#FFE4B3] transition-all uppercase"
    >
      Sign Out
    </button>
  );
}
