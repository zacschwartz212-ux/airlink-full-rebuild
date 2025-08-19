'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export default function AboutPage(){
  return (
    <div className="space-y-12 md:space-y-14">

      {/* ===== Hero (compact product peek) ===== */}
      <section className="section">
        <div className="relative overflow-hidden card p-8 md:p-12">
          {/* soft orbitals */}
          <div className="pointer-events-none absolute inset-0">
            <Orb className="top-[-120px] left-[-120px] w-[520px] h-[520px]" from="rgba(16,185,129,0.18)" />
            <Orb className="bottom-[-160px] right-[-110px] w-[480px] h-[480px]" from="rgba(52,211,153,0.14)" />
          </div>

          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200">
              Built for homeowners & contractors
            </span>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-ink dark:text-white tracking-tight">
              Home projects, without the headache.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-700 dark:text-slate-300">
              AirLink connects homeowners with vetted local pros—fast, fair, and frustration-free.
              Post in minutes, compare transparent quotes, and hire with confidence.
              Pros get Signals to jump on high-intent work first.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/post-job" className="btn-primary">Post a job</Link>
              <Link href="/find-pro" className="btn btn-outline">Find a pro</Link>
              <Link href="/signals" className="btn btn-ghost">Signals for pros</Link>
            </div>
          </div>

          {/* compact product peek strip */}
          <div className="relative mt-6 rounded-xl border border-slate-200 bg-white shadow-soft dark:bg-slate-900 dark:border-slate-800">
            <PeekStrip />
          </div>
        </div>
      </section>

      {/* ===== Proof / Stats ===== */}
      <section className="section">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat kpi="~8 min" label="Avg time to first response" />
          <Stat kpi="4.8★" label="Average pro rating" />
          <Stat kpi="97%" label="Jobs completed after hire" />
          <Stat kpi="Growing" label="Signals coverage footprint" />
        </div>
      </section>

      {/* ===== Mission / Promise / Values ===== */}
      <section className="section">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Our Mission">
            Make home projects simple and transparent for everyone involved.
          </Card>
          <Card title="Our Promise">
            Respect your time, protect your privacy, and bring clarity to pricing and scope.
          </Card>
          <Card title="Our Values">
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Speed with substance</li>
              <li>Fairness for both sides</li>
              <li>Privacy by default</li>
              <li>No junk leads, ever</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* ===== How it works (two audiences) ===== */}
      <section className="section">
        <div className="grid gap-4 lg:grid-cols-2">
          <Steps
            title="For Homeowners"
            steps={[
              { title: 'Post your project', body: 'Describe the job, add photos, choose your timing.' },
              { title: 'Compare quotes', body: 'Transparent pricing, timelines, and reviews in one place.' },
              { title: 'Hire & message', body: 'Chat privately, schedule visits, and keep docs organized.' },
              { title: 'Pay after completion', body: 'Pros pay a small success fee; homeowners pay $0.' },
            ]}
            cta={<Link href="/post-job" className="btn">Post a job</Link>}
          />
          <Steps
            title="For Contractors"
            steps={[
              { title: 'Browse or get Signals', body: 'See nearby work or get alerted the moment it posts.' },
              { title: 'Quote fast', body: 'Use templates, attach docs, and win with speed + clarity.' },
              { title: 'Build reputation', body: 'Verified license/insurance & reviews help you stand out.' },
              { title: 'Pay on success', body: 'No pay-to-bid. Small fee only when the job is won.' },
            ]}
            cta={<Link href="/jobs" className="btn">Browse jobs</Link>}
          />
        </div>
      </section>

      {/* ===== Trust & Safety ===== */}
      <section className="section">
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-semibold text-ink dark:text-white">Trust & Safety</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-700 dark:text-slate-300">
            <Bullet>License & insurance visibility where applicable</Bullet>
            <Bullet>Background-check indicators where provided</Bullet>
            <Bullet>Private in-app messaging by default</Bullet>
            <Bullet>Clear reporting & quick support follow-up</Bullet>
            <Bullet>Job history + document retention</Bullet>
            <Bullet>Abuse prevention & moderation policies</Bullet>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <MiniCard title="Privacy by default">
              Your address and contact details stay private until you’re ready to share.
            </MiniCard>
            <MiniCard title="Transparent quotes">
              Scope, line items, and timelines are clearly laid out for apples-to-apples comparisons.
            </MiniCard>
            <MiniCard title="Dispute support">
              Issues are rare. When they happen, our team investigates quickly and fairly.
            </MiniCard>
          </div>
        </div>
      </section>

      {/* ===== Coverage & Data ===== */}
      <section className="section">
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-semibold text-ink dark:text-white">Coverage & Data</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            We’re rolling out nationally. Signals monitors inspections, permits, licenses, and violations
            in supported jurisdictions. Coverage expands continuously.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Inspections</Badge>
            <Badge>Permits</Badge>
            <Badge>Licenses</Badge>
            <Badge>Violations</Badge>
            <Badge>Planned: Utilities</Badge>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-4">
            <div className="text-xs font-medium text-slate-500">Signals coverage snapshot</div>
            <CoverageBar />
            <div className="mt-2 text-xs text-slate-500">Live footprint grows weekly.</div>
          </div>
        </div>
      </section>

      {/* ===== How we make money ===== */}
      <section className="section">
        <div className="rounded-2xl border border-slate-200 p-6 md:p-8 bg-white shadow-soft dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-ink dark:text-white">How we make money</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            AirLink is <span className="font-semibold">free for homeowners</span>. Contractors use the
            platform for free and pay a <span className="font-semibold">small success fee</span> after a completed job.
            Signals is a paid add-on for pros who want instant alerts.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
            <MiniCard title="No pay-to-bid">We don’t charge for views, clicks, or messages.</MiniCard>
            <MiniCard title="Aligned incentives">We win when you win—after real, completed work.</MiniCard>
            <MiniCard title="Simple billing">Keep receipts and fees tidy for tax season.</MiniCard>
          </div>
        </div>
      </section>

      {/* ===== Milestones timeline ===== */}
      <section className="section">
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-semibold text-ink dark:text-white">Milestones</h2>
          <ol className="mt-4 relative border-l border-slate-200 dark:border-slate-800 pl-4">
            <TimelineItem date="2023" title="The spark">
              We started AirLink after too many “no-show” appointments and vague quotes.
            </TimelineItem>
            <TimelineItem date="2024" title="Signals beta">
              Pros asked for speed. We shipped instant alerts for matching jobs.
            </TimelineItem>
            <TimelineItem date="2025" title="Nationwide rollout">
              Expanding Signals data coverage and scaling the marketplace.
            </TimelineItem>
          </ol>
        </div>
      </section>

      {/* ===== Testimonials (scroll) ===== */}
      <section className="section">
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-semibold text-ink dark:text-white">What people say</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto snap-x pb-2">
            {TESTIMONIALS.map(t => (
              <Testimonial key={t.id} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Brand & Contact ===== */}
      <section className="section">
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Brand kit">
            Logos and basic guidance for press and partners.
            <div className="mt-3 flex gap-2">
              <Link href="/airlink-logo-text.png" className="btn btn-outline">Wordmark</Link>
              <Link href="/airlink-icon.png" className="btn btn-outline">Icon</Link>
            </div>
          </Card>
          <Card title="Contact">
            <div className="mt-1 text-slate-700 dark:text-slate-300 text-sm leading-6">
              Support: <a href="mailto:hello@useairlink.com" className="underline">hello@useairlink.com</a><br/>
              Media & partnerships: <a href="mailto:press@useairlink.com" className="underline">press@useairlink.com</a>
            </div>
          </Card>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section">
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-semibold text-ink dark:text-white">FAQ</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <FAQ q="Is AirLink free for homeowners?">
              Yes. Posting, messaging, and hiring are free for homeowners.
            </FAQ>
            <FAQ q="Do contractors pay to bid?">
              No. Contractors only pay a small success fee after the job is completed.
            </FAQ>
            <FAQ q="What is Signals?">
              Signals instantly alerts pros when matching jobs get posted, so they can respond first.
            </FAQ>
            <FAQ q="How do you handle privacy?">
              Contact info stays private until you choose to share; messaging is in-app by default.
            </FAQ>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="card p-8 md:p-10 text-center">
          <h3 className="text-xl md:text-2xl font-semibold text-ink dark:text-white">
            Ready to try AirLink?
          </h3>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            Post your project or start winning jobs with Signals.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Link href="/post-job" className="btn-primary">Post a job</Link>
            <Link href="/jobs" className="btn btn-outline">Browse jobs</Link>
            <Link href="/signals" className="btn btn-ghost">Signals for pros</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ===================== Small components ===================== */

function Orb({ className, from }:{ className?:string; from:string }){
  return (
    <div
      className={`absolute rounded-full opacity-80 ${className || ''}`}
      style={{ background: `radial-gradient(closest-side, ${from}, transparent 70%)` }}
      aria-hidden
    />
  )
}

function Card({title, children}:{title:string; children:React.ReactNode}){
  return (
    <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-soft dark:bg-slate-900 dark:border-slate-800">
      <div className="font-semibold text-ink dark:text-white">{title}</div>
      <div className="mt-2 text-slate-700 dark:text-slate-300 text-sm">{children}</div>
    </div>
  )
}

function MiniCard({title, children}:{title:string; children:React.ReactNode}){
  return (
    <div className="rounded-xl border border-slate-200 p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="font-medium text-ink dark:text-white text-sm">{title}</div>
      <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  )
}

function Bullet({children}:{children:React.ReactNode}){
  return (
    <div className="flex items-start gap-2">
      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
      <span className="text-sm">{children}</span>
    </div>
  )
}

function Stat({ kpi, label }:{ kpi:string; label:string }){
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:bg-slate-900 dark:border-slate-800">
      <div className="text-2xl font-semibold text-ink dark:text-white">{kpi}</div>
      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{label}</div>
    </div>
  )
}

function Steps({
  title, steps, cta
}:{
  title:string,
  steps:{ title:string; body:string }[],
  cta?:React.ReactNode
}){
  return (
    <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-soft dark:bg-slate-900 dark:border-slate-800">
      <div className="font-semibold text-ink dark:text-white">{title}</div>
      <ol className="mt-3 space-y-3">
        {steps.map((s, i)=>(
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold dark:bg-emerald-950 dark:text-emerald-200">
              {i+1}
            </span>
            <div>
              <div className="text-sm font-medium text-ink dark:text-white">{s.title}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{s.body}</div>
            </div>
          </li>
        ))}
      </ol>
      {cta ? <div className="mt-4">{cta}</div> : null}
    </div>
  )
}

function TimelineItem({ date, title, children }:{ date:string; title:string; children:React.ReactNode }){
  return (
    <li className="mb-4 pl-4">
      <span className="absolute -left-[7px] mt-1 inline-block h-3 w-3 rounded-full bg-emerald-500" />
      <div className="text-xs uppercase tracking-wide text-slate-500">{date}</div>
      <div className="font-medium text-ink dark:text-white">{title}</div>
      <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>
    </li>
  )
}

function Badge({ children }:{ children:React.ReactNode }){
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
      {children}
    </span>
  )
}

function CoverageBar(){
  return (
    <div className="mt-2 h-2 w-full rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className="h-2 w-2/5 bg-emerald-500" />
    </div>
  )
}

function Testimonial({ quote, name, role }:{ quote:string; name:string; role:string }){
  return (
    <figure className="min-w-[260px] max-w-sm snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:bg-slate-900 dark:border-slate-800">
      <blockquote className="text-sm text-slate-700 dark:text-slate-300">“{quote}”</blockquote>
      <figcaption className="mt-3">
        <div className="text-sm font-medium text-ink dark:text-white">{name}</div>
        <div className="text-xs text-slate-500">{role}</div>
      </figcaption>
    </figure>
  )
}

/* ---------- New compact product peek ---------- */
function PeekStrip(){
  return (
    <div className="h-[84px] md:h-[104px] w-full overflow-hidden rounded-xl">
      <div className="grid h-full grid-cols-3 gap-2 p-2">
        {/* Homeowner */}
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Homeowner</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 w-24 rounded bg-slate-200" />
            <div className="h-2 w-16 rounded bg-slate-200" />
          </div>
          <div className="mt-2 h-5 w-24 rounded bg-emerald-500/80" />
        </div>
        {/* Quotes */}
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Quotes</div>
          <div className="mt-1 h-8 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-2 h-2 w-20 rounded bg-slate-200" />
        </div>
        {/* Signals */}
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Signals</div>
          <div className="mt-1 h-2 w-24 rounded bg-slate-200" />
          <div className="mt-1 h-2 w-28 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-full rounded bg-emerald-100 dark:bg-emerald-950/40" />
        </div>
      </div>
    </div>
  )
}

const TESTIMONIALS = [
  { id:'t1', quote:'We had three quotes within an hour and picked the winner that afternoon.', name:'Lindsey R.', role:'Homeowner • Austin, TX' },
  { id:'t2', quote:'Signals is the difference between “saw it late” and “won it”.', name:'Marco D.', role:'HVAC Pro • Jersey City, NJ' },
  { id:'t3', quote:'Clear scope templates saved us so much back-and-forth.', name:'Priya K.', role:'Homeowner • Seattle, WA' },
]

/* ===== Accessible FAQ ===== */
function FAQ({ q, children }:{ q:string; children:React.ReactNode }){
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
      <button
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
        onClick={()=>setOpen(o=>!o)}
      >
        <span className="font-medium text-ink dark:text-white">{q}</span>
        <span className={`ml-3 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">{children}</div>}
    </div>
  )
}
