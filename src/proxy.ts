import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "@/lib/auth";

const intlProxy = createMiddleware(routing);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Адмінка — окремий контур: без next-intl (інтерфейс завжди українською,
  // без мовного префікса), захищена сесією Auth.js (isAdmin).
  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
      return NextResponse.next();
    }

    const session = await auth();
    if (!session?.user?.isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return intlProxy(request);
}

export const config = {
  matcher: [
    // усі шляхи, крім службових next.js/api/статики
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
