import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SignOutButton from "./auth/SignOutButton";

export default async function Header() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
    <header className="border-b">
      <div className="mx-auto max-w-screen-xl px-4 flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">Home</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/#about" className="hidden sm:inline hover:underline">About</Link>
          <Link href="/#tracks" className="hidden sm:inline hover:underline">Tracks</Link>
          <Link href="/#schedule" className="hidden sm:inline hover:underline">Schedule</Link>
          <Link href="/#sponsors" className="hidden sm:inline hover:underline">Sponsors</Link>
          <Link href="/#faq" className="hidden sm:inline hover:underline">FAQ</Link>
          <Link href="/portal" className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border bg-black text-white border-black hover:opacity-90">
            Portal
          </Link>
          {user ? (
            <SignOutButton />
          ) : (
            <Link href="/login" className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border hover:bg-gray-50">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}