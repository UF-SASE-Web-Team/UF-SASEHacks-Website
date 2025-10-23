import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_uid: user.id });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("registrations")
    .select("user_id, status, editing_locked, resume_updated_at, profiles(full_name,email,school,major,tshirt,country)");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data ?? []) as any[];
  const header = [
    "user_id","full_name","email","school","major","tshirt","country",
    "status","editing_locked","resume_updated_at"
  ];
  const lines = [header.join(",")];

  for (const r of rows) {
    const p = r.profiles ?? {};
    const vals = [
      r.user_id,
      p.full_name ?? "",
      p.email ?? "",
      p.school ?? "",
      p.major ?? "",
      p.tshirt ?? "",
      p.country ?? "",
      r.status ?? "",
      String(!!r.editing_locked),
      r.resume_updated_at ?? "",
    ].map(v => {
      const s = String(v ?? "");
      return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    });
    lines.push(vals.join(","));
  }

  const csv = lines.join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="registrations.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
