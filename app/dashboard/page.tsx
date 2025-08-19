// app/dashboard/page.tsx
'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/state'

type Role = 'HOMEOWNER' | 'CONTRACTOR'

export default function DashboardPage() {
  const { state, openAuth } = useApp()
  const signedIn = !!state.user.signedIn
  const actualRole = state.user.role as Role | undefined

  // If not signed in or no role, allow previewing either dashboard
  const [previewRole, setPreviewRole] = useState<Role | null>(actualRole ?? null)
  const role: Role | null = useMemo(()=> actualRole ?? previewRole, [actualRole, previewRole])

  const RoleBadge = ({ role }: { role: Role }) => (
    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
      role==='CONTRACTOR'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200'
        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
    }`}>
      {role === 'CONTRACTOR' ? 'Contractor' : 'Homeowner'}
    </span>
  )

  const HeaderRow = () => (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold text-ink dark:text-white">
          Dashboard
        </h1>
        {role ? <RoleBadge role={role} /> : null}
      </div>

      <div className="flex items-center gap-2">
        {!signedIn && (
          <>
            <button className="btn btn-outline" onClick={openAuth}>Sign in</button>
            <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700" />
          </>
        )}

        {/* Preview switch when not signed in or role unknown */}
        {!signedIn || !actualRole ? (
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={()=>setPreviewRole('HOMEOWNER')}
              className={`px-3 py-1 text-sm ${role==='HOMEOWNER' ? 'bg-emerald-600 text-white' : 'bg-transparent text-ink dark:text-white'}`}
            >
              Preview Homeowner
            </button>
            <button
              onClick={()=>setPreviewRole('CONTRACTOR')}
              className={`px-3 py-1 text-sm ${role==='CONTRACTOR' ? 'bg-blue-600 text-white' : 'bg-transparent text-ink dark:text-white'}`}
            >
              Preview Contractor
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )

  if (!role) {
    // Neutral prompt until a preview is chosen
    return (
      <div className="mx-auto max-w-3xl">
        <HeaderRow />
        <div className="card p-6">
          <p className="text-slate-700 dark:text-slate-300">
            Choose a view to explore the dashboard, or sign in to see your personalized experience.
          </p>
          <div className="mt-4 flex gap-2">
            <button className="btn" onClick={()=>setPreviewRole('HOMEOWNER')}>Preview Homeowner</button>
            <button className="btn" onClick={()=>setPreviewRole('CONTRACTOR')}>Preview Contractor</button>
            <button className="btn-primary ml-auto" onClick={openAuth}>Sign in</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <HeaderRow />
      {role === 'CONTRACTOR'
        ? <ContractorDashboard name={state.user.name} />
        : <HomeownerDashboard name={state.user.name} />
      }
    </div>
  )
}

/* ---------- Shared bits ---------- */
function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink dark:text-white">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  )
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-ink dark:text-white">{children}</h2>
      {action}
    </div>
  )
}

/* ---------- Homeowner ---------- */
function HomeownerDashboard({ name }: { name?: string }) {
  const jobs = [
    { id: 'J-1029', title: 'AC not cooling', status: 'Open', quotes: 3, created: 'Today' },
    { id: 'J-1023', title: 'Water heater install', status: 'Reviewing', quotes: 2, created: '2d' },
  ]
  const recPros = [
    { id: 'P-220', name: 'Chill Masters HVAC', rating: 4.9, jobs: 128 },
    { id: 'P-114', name: 'RapidFix Plumbing', rating: 4.8, jobs: 203 },
    { id: 'P-087', name: 'Precision Climate NY', rating: 4.7, jobs: 157 },
  ]
  const activity = [
    { id:'A1', text:'New quote received from Chill Masters', time:'2h' },
    { id:'A2', text:'You saved RapidFix Plumbing', time:'1d' },
    { id:'A3', text:'Job J-1023 moved to Reviewing', time:'2d' },
  ]

  return (
    <>
      {/* Overview + Quick actions */}
      <section>
        <SectionTitle action={<Link href="/post-job" className="btn-primary">Post a Job</Link>}>Overview</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Jobs" value={jobs.length} hint="Across all addresses" />
          <StatCard label="Quotes Received" value={jobs.reduce((a,b)=>a+b.quotes,0)} hint="Last 7 days" />
          <StatCard label="New Messages" value={1} />
          <StatCard label="Saved Pros" value={4} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/quotes" className="btn">Compare Quotes</Link>
          <Link href="/find-pro" className="btn">Search for a Pro</Link>
          <Link href="/settings" className="btn">Settings</Link>
        </div>
      </section>

      {/* Jobs */}
      <section>
        <SectionTitle action={<Link href="/history" className="text-brand underline text-sm">View all</Link>}>
          My Jobs
        </SectionTitle>
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Job</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Quotes</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900">
              {jobs.map(j => (
                <tr key={j.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{j.title}</td>
                  <td className="px-4 py-3">{j.status}</td>
                  <td className="px-4 py-3">{j.quotes}</td>
                  <td className="px-4 py-3">{j.created}</td>
                  <td className="px-4 py-3">
                    <Link href={`/jobs/${j.id}`} className="text-brand underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recommended pros + Activity */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="mb-2 font-semibold text-ink dark:text-white">Recommended Pros</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recPros.map(p=>(
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.rating}★ • {p.jobs} jobs</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/pros/${p.id}`} className="btn btn-outline">View</Link>
                  <Link href={`/messages/new?to=${p.id}`} className="btn">Message</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="mb-2 font-semibold text-ink dark:text-white">Activity</h3>
          <ul className="space-y-2 text-sm">
            {activity.map(a=>(
              <li key={a.id} className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-200">{a.text}</span>
                <span className="text-slate-500">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Checklist */}
      <section>
        <SectionTitle>Getting Started Checklist</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { text:'Add your property address', done:true },
            { text:'Post your first job', done:false },
            { text:'Save 3 favorite pros', done:false },
            { text:'Enable SMS updates', done:true },
            { text:'Verify email', done:true },
            { text:'Turn on job reminders', done:false },
          ].map((c,i)=>(
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${c.done ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <span className={`${c.done ? 'line-through text-slate-500' : ''}`}>{c.text}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

/* ---------- Contractor ---------- */
function ContractorDashboard({ name }: { name?: string }) {
  const leads = [
    { id: 'L-3301', title: 'Mini-split install', zip: '11211', budget: '$2,400' },
    { id: 'L-3298', title: 'AC tune-up', zip: '10001', budget: '$180' },
    { id: 'L-3290', title: 'Boiler no heat', zip: '07030', budget: '$600' },
  ]
  const activity = [
    { id:'A1', text:'Quoted J-1029 ($2,150)', time:'1h' },
    { id:'A2', text:'Won job J-1017', time:'1d' },
    { id:'A3', text:'Signal added: “boiler, 07030”', time:'2d' },
  ]

  return (
    <>
      {/* Overview + Quick actions */}
      <section>
        <SectionTitle action={<Link href="/jobs" className="btn-primary">Browse Jobs</Link>}>Overview</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Open Leads" value={leads.length} />
          <StatCard label="Active Quotes" value={4} hint="2 awaiting response" />
          <StatCard label="Jobs Won (30d)" value={3} />
          <StatCard label="Signals" value={12} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/quotes/templates" className="btn">Quote Templates</Link>
          <Link href="/signals" className="btn">Manage Signals</Link>
          <Link href="/billing" className="btn">Billing</Link>
          <Link href="/settings" className="btn">Settings</Link>
        </div>
      </section>

      {/* Lead Feed */}
      <section>
        <SectionTitle action={<Link href="/jobs" className="text-brand underline text-sm">See all</Link>}>
          Lead Feed
        </SectionTitle>
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">ZIP</th>
                <th className="px-4 py-3 text-left font-medium">Budget</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900">
              {leads.map(l => (
                <tr key={l.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{l.title}</td>
                  <td className="px-4 py-3">{l.zip}</td>
                  <td className="px-4 py-3">{l.budget}</td>
                  <td className="px-4 py-3">
                    <Link href={`/jobs/${l.id}`} className="text-brand underline">View</Link>
                    <span className="mx-2 text-slate-300">|</span>
                    <Link href={`/quotes/new?lead=${l.id}`} className="text-brand underline">Quote</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Signals / Profile / Activity */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="mb-2 font-semibold text-ink dark:text-white">Signals</h3>
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">Instant alerts for jobs matching your specialties.</p>
          <Link href="/signals" className="btn">Manage Signals</Link>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="mb-2 font-semibold text-ink dark:text-white">Profile completeness</h3>
          <ul className="list-inside list-disc text-sm text-slate-700 dark:text-slate-200">
            <li>License uploaded</li>
            <li>Reviews synced</li>
            <li>Service area set</li>
            <li>Insurance verified</li>
          </ul>
          <Link href="/profile" className="mt-3 inline-block text-brand underline">Edit profile</Link>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="mb-2 font-semibold text-ink dark:text-white">Activity</h3>
          <ul className="space-y-2 text-sm">
            {activity.map(a=>(
              <li key={a.id} className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-200">{a.text}</span>
                <span className="text-slate-500">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quote Templates & Coverage map stubs */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="mb-2 font-semibold text-ink dark:text-white">Quote Templates</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Create fast, consistent quotes with saved templates.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/quotes/templates/new" className="btn">New Template</Link>
            <Link href="/quotes/templates" className="btn btn-outline">Manage</Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="mb-2 font-semibold text-ink dark:text-white">Coverage & Availability</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Set your service area and booking hours.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/settings/coverage" className="btn">Edit Coverage</Link>
            <Link href="/settings/availability" className="btn btn-outline">Set Hours</Link>
          </div>
        </div>
      </section>
    </>
  )
}
