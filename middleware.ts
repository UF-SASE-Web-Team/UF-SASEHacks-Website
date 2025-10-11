import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, _options) {
          req.cookies.set(name, value);
          res.cookies.set(name, value, _options);
        },
        remove(name: string, _options) {
          req.cookies.set(name, "");
          res.cookies.set(name, "", _options);
        },
      },
    }
  );

  await supabase.auth.getUser(); // refresh session if needed
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/faq).*)"],
};
