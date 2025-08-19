// app/api/sign-up/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { ensureSchema, getUserByEmail, insertUser } from "@/lib/db"

export const runtime = "nodejs"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().min(2, "Name is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = schema.parse(body)

    await ensureSchema()

    const exists = await getUserByEmail(email)
    if (exists) {
      return NextResponse.json({ ok: false, error: "Email is already registered." }, { status: 409 })
    }

    const hash = await bcrypt.hash(password.trim(), 12)
    await insertUser(email, name, hash)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const msg = err?.issues?.[0]?.message || err?.message || "Invalid request"
    console.error("[sign-up] error:", err)
    return NextResponse.json({ ok: false, error: msg }, { status: 400 })
  }
}
