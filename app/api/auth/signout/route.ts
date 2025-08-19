// app/api/auth/signout/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  const wipe = { path: "/", maxAge: 0 };
  res.cookies.set("al_authed", "", wipe);
  res.cookies.set("al_role", "", wipe);
  res.cookies.set("al_user", "", wipe);
  res.cookies.set("al_email", "", wipe);
  return res;
}
