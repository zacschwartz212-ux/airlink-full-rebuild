"use client"
import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    const json = await res.json()
    if (!json.ok) {
      setError(json.error || "Unable to create account.")
      setLoading(false)
      return
    }
    const si = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/post-a-job" })
    if (si?.error) setError("Account created, but sign-in failed.")
    router.push(si?.url || "/post-a-job")
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="name" value={name} onChange={e=>setName(e.target.value)} />
      <input name="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input name="password" type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required />
      {error && <p className="text-rose-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
    </form>
  )
}

// app/signup/page.tsx
import Link from "next/link";

export default function SignUpPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-semibold">Create your account</h1>
      <p className="mb-6 text-sm text-gray-600">
        Choose a role to personalize your dashboard.
      </p>

      <form action="/api/auth/signin" method="POST" className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="homeowner" required />
              <span>Homeowner</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="contractor" required />
              <span>Contractor</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-emerald-700 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
