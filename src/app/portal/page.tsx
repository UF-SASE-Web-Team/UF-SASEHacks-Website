import { createSupabaseServerClient } from "@/lib/supabase/server";
import SignInForm from "@/components/auth/SignInForm";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function PortalPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-screen-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Portal (temporary)</h1>
      <p className="text-gray-600 mt-2">
        This page shows your auth status. Coming soon!
      </p>

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="font-medium mb-2">Auth status</h2>
        {!user ? (
          <>
            <div className="text-sm text-gray-700 mb-4">You are not signed in.</div>
            <SignInForm />
          </>
        ) : (
          <>
            <div className="text-sm text-gray-700">
              Signed in as <span className="font-mono">{user.email}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">User ID: {user.id}</div>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
