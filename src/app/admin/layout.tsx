import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/login?next=${encodeURIComponent("/admin")}`);
    };

    const { data: isAdmin, error } = await supabase.rpc("is_admin", { p_uid: user.id });
    if (error || !isAdmin) {
        redirect("/portal");
    };

    return <>{children}</>;
}