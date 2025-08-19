// components/Footer.tsx
'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApp } from '../lib/state'

export default function Footer(){
  const pathname = usePathname()
  const router = useRouter()
  const { state, openAuth } = useApp()

  const isActive = (href:string) => pathname === href || (href !== '/' && pathname.startsWith(href))

  const FLink = ({ href, children }:{ href:string; children:React.ReactNode }) => {
    const active = isActive(href)
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 hover:text-ink dark:hover:text-white transition ${active ? 'text-brand font-semibold' : ''}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-brand' : 'bg-transparent'}`} />
        <span>{children}</span>
      </Link>
    )
  }

  // Auth-gated Dashboard entry
  const DashboardItem = () => {
    const active = isActive('/dashboard')
    return (
      <button
        type="button"
        onClick={()=>{
          if (state.user.signedIn) router.push('/dashboard')
          else openAuth()
        }}
        className={`flex items-center gap-2 hover:text-ink dark:hover:text-white transition text-left ${
          active ? 'text-brand font-semibold' : ''
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-brand' : 'bg-transparent'}`} />
        <span>Dashboard</span>
      </button>
    )
  }

  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="container-max py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-slate-600 dark:text-slate-300">
        <div>
          {/* text wordmark */}
          <img src="/airlink-logo-text.png" alt="AirLink" className="mb-2 h-7" />
          <p className="max-w-xs">Linking Homeowners with Local Pros Instantly. Post a job, get bids, hire with confidence.</p>
        </div>

        <div>
          <div className="font-semibold text-ink dark:text-white mb-2">Company</div>
          <ul className="space-y-2">
            <li><FLink href="/about">About</FLink></li>
            <li><FLink href="/pricing">Pricing</FLink></li>
            <li><DashboardItem /></li> {/* Dashboard - auth gated */}
          </ul>
        </div>

        <div>
          <div className="font-semibold text-ink dark:text-white mb-2">Explore</div>
          <ul className="space-y-2">
            <li><FLink href="/">Home</FLink></li>
            <li><FLink href="/how-it-works">How it Works</FLink></li>
            <li><FLink href="/find-work/how-it-works">How it Works - Pros</FLink></li>
            <li><FLink href="/find-pro">Search for a Pro</FLink></li>
            <li><FLink href="/jobs">Browse Jobs</FLink></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-ink dark:text-white mb-2">Legal & Contact</div>
          <ul className="space-y-2">
            <li><FLink href="/terms">Terms</FLink></li>
            <li><FLink href="/privacy">Privacy</FLink></li>
            <li><a className="hover:text-ink dark:hover:text-white" href="mailto:hello@useairlink.com">hello@useairlink.com</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800">
        <div className="container-max py-4 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3">
          <span>© {year} AirLink</span>
          <span className="mx-2 hidden sm:inline">•</span>
          <span>Made for homeowners & contractors</span>
        </div>
      </div>
    </footer>
  )
}
