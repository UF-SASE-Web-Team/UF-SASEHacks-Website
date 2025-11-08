import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SignOutButton from "./auth/SignOutButton";

export default async function Header() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
    <header className="w-full bg-[#560700]">
      <div className="mx-auto max-w-screen-xl px-4 flex h-16 items-center justify-between">
        <Link href="/" className="font-[family-name:var(--font-heading)] text-[#FFE4B3] text-2xl md:text-3xl hover:opacity-90 transition-opacity">
          SASEHacks
        </Link>
        <nav className="flex items-center gap-3 md:gap-6 text-sm font-[family-name:var(--font-body)]">
          <Link href="/#about" className="hidden sm:inline text-[#FFE4B3] hover:opacity-80 transition-opacity">About</Link>
          <Link href="/#tracks" className="hidden sm:inline text-[#FFE4B3] hover:opacity-80 transition-opacity">Tracks</Link>
          <Link href="/#schedule" className="hidden sm:inline text-[#FFE4B3] hover:opacity-80 transition-opacity">Schedule</Link>
          <Link href="/#sponsors" className="hidden sm:inline text-[#FFE4B3] hover:opacity-80 transition-opacity">Sponsors</Link>
          <Link href="/#faq" className="hidden sm:inline text-[#FFE4B3] hover:opacity-80 transition-opacity">FAQ</Link>
          <Link href="/portal" className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium bg-[#FFE4B3] text-[#560700] hover:opacity-90 transition-opacity">
            Portal
          </Link>
          {user ? (
            <SignOutButton />
          ) : (
            <Link href="/login" className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border border-[#FFE4B3] text-[#FFE4B3] hover:bg-[#FFE4B3] hover:text-[#560700] transition-colors">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}