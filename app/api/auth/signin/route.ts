// app/api/auth/signin/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const role = String(form.get("role") || "");
  const name = String(form.get("name") || "Guest");
  const email = String(form.get("email") || "");
  const callbackUrl = String(form.get("callbackUrl") || "/dashboard");

  if (!["contractor", "homeowner"].includes(role)) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("error", "Choose a role");
    return NextResponse.redirect(url);
  }

  const res = NextResponse.redirect(new URL(callbackUrl, req.url));
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };

  res.cookies.set("al_authed", "true", cookieOpts);
  res.cookies.set("al_role", role, cookieOpts);
  if (email) res.cookies.set("al_email", email, cookieOpts);
  // name is ok as non-HTTPOnly for simple display
  res.cookies.set({
    name: "al_user",
    value: name,
    ...cookieOpts,
    httpOnly: false,
  });

  return res;
}
