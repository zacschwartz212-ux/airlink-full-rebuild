// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { ensureSchema, getUserByEmail } from "@/lib/db"

export const runtime = "nodejs"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        try {
          const email = (creds?.email || "").toLowerCase().trim()
          const password = (creds?.password || "").trim()
          if (!email || !password) return null

          await ensureSchema()

          const user = await getUserByEmail(email)
          if (!user) return null

          const ok = await bcrypt.compare(password, user.password_hash)
          if (!ok) return null

          return { id: user.id, email: user.email, name: user.name }
        } catch (e) {
          console.error("[nextauth authorize] error:", e)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) { if (user) token.id = (user as any).id; return token },
    async session({ session, token }) { if (session.user) (session.user as any).id = token.id; return session },
  },
})

export { handler as GET, handler as POST }
