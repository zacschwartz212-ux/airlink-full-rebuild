"use client"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") || "/post-a-job"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl })
    setLoading(false)
    if (res?.error) setError("Invalid email or password.")
    else router.push(res?.url || callbackUrl)
  }

  return (
    <form onSubmit={onSubmit}>
      {/* make sure your inputs have these names or set state manually */}
      <input name="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      {error && <p className="text-rose-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
  )
}

// app/signin/page.tsx
import Link from "next/link";

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string; error?: string };
}) {
  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";
  const error = searchParams?.error;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-semibold">Welcome back</h1>
      <p className="mb-6 text-sm text-gray-600">
        Sign in to access your dashboard.
      </p>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

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
          Continue
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        New here?{" "}
        <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-emerald-700 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
