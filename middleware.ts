import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // allow auth & your public pages
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/signin") || // your route
    pathname.startsWith("/signup") || // your route
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) return NextResponse.next()

  // protect post-a-job (add more as needed)
  const needsAuth = pathname === "/post-a-job" || pathname.startsWith("/post-a-job/")
  if (!needsAuth) return NextResponse.next()

  const hasSession = req.cookies.has("__Secure-next-auth.session-token") || req.cookies.has("next-auth.session-token")
  if (hasSession) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = "/signin" // your route
  url.search = `?callbackUrl=${encodeURIComponent(pathname + search)}`
  return NextResponse.redirect(url)
}
export const config = { matcher: ["/post-a-job", "/post-a-job/:path*"] }
