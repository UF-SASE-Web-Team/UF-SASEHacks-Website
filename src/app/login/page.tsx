import SignInForm from "@/components/auth/SignInForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const sp = await searchParams;
  const next = sp?.next ?? "/portal";
  return (
    <div className="mx-auto max-w-screen-sm px-4 py-10">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-gray-600 mt-2 text-sm">Sign in via email magic link.</p>
      <div className="mt-6 rounded-xl border p-4">
        <SignInForm next={next} />
      </div>
    </div>
  );
}