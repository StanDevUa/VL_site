import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlProxy = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // Адмінка — окремий контур: без next-intl (інтерфейс завжди українською,
  // без мовного префікса), захист сесією/isAdmin буде додано разом з Auth.js.
  if (request.nextUrl.pathname.startsWith("/admin")) {
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
