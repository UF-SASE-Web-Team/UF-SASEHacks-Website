import { createSupabaseServerClient } from "@/lib/supabase/server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    let showDashboard = false;
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("first_name,last_name,full_name,school")
            .eq("id", user.id)
            .maybeSingle();

        const hasCompleteName = (profile?.first_name && profile?.last_name) || profile?.full_name;
        showDashboard = !!(hasCompleteName && profile?.school);
    }

    // pass the user data to the client component
    return <HeaderClient user={user} showDashboard={showDashboard} />;
}