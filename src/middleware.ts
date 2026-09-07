import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routes reachable without a signed-in landlord: L-01's own pages
 * (spec/screens/landlord/L-01-sign-in.md), its PKCE callback, the public
 * tenant surface (spec/decisions.md D1/D2 -- token-gated, not
 * session-gated), and the dev-only playground (already prod-gated by
 * src/lib/dev-only.ts).
 */
const PUBLIC_PREFIXES = ["/signin", "/signup", "/reset", "/auth/callback", "/u", "/dev"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Two jobs: refresh the Supabase session cookie on every request (the
 * standard @supabase/ssr pattern -- server.ts's own comment already
 * assumes this exists), and gate every non-public route behind a signed
 * in session, deny-by-default (spec/cross-cutting.md E4: "Reach any
 * landlord route while signed out -> redirect to L-01, then return to
 * the intended screen after signing in"). Deny-by-default rather than an
 * allowlist of protected routes means every future (landlord) route
 * (L-02..L-15) is automatically protected the moment it's created.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Must be getUser(), not getSession() -- getSession() only reads the
  // (unverified) cookie, getUser() revalidates against Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return response;
  }

  if (!user) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
