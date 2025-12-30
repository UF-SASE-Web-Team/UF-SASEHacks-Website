import { createSupabaseServerClient } from "@/lib/supabase/server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // pass the user data to the client component
    return <HeaderClient user={user} />;
}