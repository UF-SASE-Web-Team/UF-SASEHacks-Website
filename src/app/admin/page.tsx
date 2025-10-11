import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal");

  const { data: isAdmin, error } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (error) {
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const hasAdmin = !!roleRows?.find(r => r.role === "admin");
    if (!hasAdmin) redirect("/portal");
  } else if (!isAdmin) {
    redirect("/portal");
  }

  return (
    <div className="mx-auto max-w-screen-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin (temporary)</h1>
      <p className="text-gray-600 mt-2">
        You are an admin.
      </p>
      <ul className="mt-6 list-disc pl-6 text-sm text-gray-700">
        <li>Confirmed you can access /admin.</li>
        <li>Non-admins will be redirected to /portal.</li>
      </ul>
    </div>
  );
}
