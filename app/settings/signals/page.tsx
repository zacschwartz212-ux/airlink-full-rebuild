'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useApp } from '../../lib/state'
import SignalsCard from '../../components/SignalsCard'
import Testimonials from '../../components/Testimonials'

export default function SignalsPage(){
  const { state, openAuth, addToast } = useApp()
  const isSignedIn = state.user.signedIn
  const isContractor = state.user.role === 'CONTRACTOR'

  const preview = useMemo(()=> state.signals.slice(0,6), [state.signals])
  const totalSignals = state.signals.length
  const perDay = Math.max(1, Math.round(totalSignals / 30))

  // inline email capture (opens the auth modal)
  const [email, setEmail] = useState('')
  const capture = ()=>{
    openAuth()
    if(email.trim()) addToast('We’ll use this email when you continue sign-in.')
  }

  const PrimaryCTA = () =>
    !isSignedIn
      ? <button onClick={openAuth} className="btn-primary">Start free alerts</button>
      : <Link href="/signals/dashboard" className="btn-primary">Open Signals dashboard</Link>

  const SecondaryCTA = () =>
    !isSignedIn
      ? <button onClick={openAuth} className="btn btn-outline">See sample feed</button>
      : <Link href="/pro/signals/rules/new" className="btn btn-outline">Create alert rule</Link>

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-900/20 dark:via-slate-900 dark:to-emerald-900/10">
        {/* rotated, cut-off wordmark */}
        <img
          src="/airlink-logo-text.png"
          alt=""
          aria-hidden
          className="pointer-events-none select-none absolute -top-16 -right-24 w-[720px] rotate-[-14deg] opacity-[0.06] dark:opacity-[0.08]"
        />
        <div className="container-max py-14 md:py-20 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium shadow-soft ring-1 ring-emerald-200 backdrop-blur dark:bg-white/10 dark:text-emerald-100 dark:ring-emerald-700">
              ⚡ New leads, automatically • Be first—before they even ask
            </div>

            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight text-ink dark:text-white">
              Signals: be first to the lead—<span className="text-emerald-600">before they even reach out</span>.
            </h1>

            <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl">
              We monitor inspections, permits, licenses, and violations across your coverage. The instant
              something matches your rules, you’re notified—so you quote first and win more work.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryCTA />
              <SecondaryCTA />
              <Link href="/pricing#signals" className="btn ghost">Pricing</Link>
            </div>

            {/* quick capture */}
            {!isSignedIn && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <input
                  className="input w-64"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                />
                <button className="btn" onClick={capture}>Get started</button>
                <span className="text-xs text-slate-500">No spam. Cancel anytime.</span>
              </div>
            )}

            {/* hero stats */}
            <div className="mt-6 grid grid-cols-3 max-w-lg gap-3 text-center">
              <Stat label="Signals this month" value={totalSignals} />
              <Stat label="Avg. per day" value={perDay} />
              <Stat label="Setup time" value="2 min" />
            </div>
          </div>
        </div>
      </section>

      {/* sticky local nav */}
      <SectionNav />

      {/* HOW IT WORKS */}
      <section id="how" className="container-max">
        <SectionHeader eyebrow="How Signals works" title="From data to deal in four steps" />
        <div className="grid md:grid-cols-4 gap-4">
          <Step n={1} t="Pick coverage" d="Choose jurisdictions, categories, and keywords." />
          <Step n={2} t="Build rules" d="Event type, status, zip lists, scope terms, and more." />
          <Step n={3} t="Get alerts" d="Email, SMS, or in-app. Instant or daily digest." />
          <Step n={4} t="Win the job" d="Contact first with context & confidence." />
        </div>
      </section>

      {/* RULE BUILDER TEASER */}
      <section className="container-max">
        <div className="card p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="text-ink dark:text-white font-semibold">Point-and-click rule builder</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Stack filters to match your niche. Save multiple views—electrical service upgrades, failed HVAC inspections,
                roofing violations—then choose instant alerts or a daily summary.
              </p>
            </div>
            <Link href="/pro/signals/rules/new" className="btn btn-outline shrink-0">Create a rule</Link>
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
            <RuleChip label="Type" value="Inspection: Failed" />
            <RuleChip label="Jurisdiction" value="Brooklyn + Queens" />
            <RuleChip label="Scope keywords" value="panel|service|condenser|roof leak" />
            <RuleChip label="Zip list" value="11205, 11206, 11215, 11217" />
            <RuleChip label="Delivery" value="Instant SMS + Email" />
            <RuleChip label="Window" value="Only business hours" />
          </div>
        </div>
      </section>

      {/* LIVE FEED PREVIEW */}
      <section id="feed" className="container-max">
        <div className="flex items-end justify-between mb-3">
          <h3 className="text-xl font-semibold text-ink dark:text-white">Live feed preview</h3>
          <div className="flex gap-2">
            <Link href="/signals/dashboard" className="btn btn-outline">Open dashboard</Link>
            <Link href="/pro/signals/rules/new" className="btn btn-outline">Create a rule</Link>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {preview.map(s => <SignalsCard key={s.id} s={s} />)}
        </div>
        {preview.length===0 && (
          <div className="card p-6 text-center text-slate-600 mt-2">
            No events yet in the demo dataset. Create a rule to start seeing alerts.
          </div>
        )}
      </section>

      {/* ROI CALCULATOR + FEATURES */}
      <section id="features" className="container-max grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-ink dark:text-white mb-3">Why pros love Signals</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Feature icon="🛰️" t="Real-time monitoring" d="We watch inspections, permits, licenses and violations across your selected jurisdictions." />
            <Feature icon="🎯" t="Precision rules" d="Target by type, status, zip lists, and scope keywords. No more irrelevant leads." />
            <Feature icon="📣" t="Multi-channel alerts" d="Email, SMS, in-app. Instant or digest." />
            <Feature icon="🧠" t="AI scope hints" d="We summarize the event and suggest an outreach opener with likely scope." />
            <Feature icon="📤" t="Export & share" d="CSV export and clipboard-ready outreach lists." />
            <Feature icon="🔒" t="Private to you" d="Signals are your edge—not a public marketplace blast." />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-[84px]">
            <div className="font-semibold text-ink dark:text-white">ROI quick calc</div>
            <RoiCalc />
          </div>
        </div>
      </section>

      {/* COMPARISON STRIP */}
      <section className="container-max">
        <h3 className="text-xl font-semibold text-ink dark:text-white mb-3">Signals vs. traditional lead marketplaces</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <Compare t="How it works" a="You compete after a homeowner posts" s="You reach out at the source—permit/inspection triggers" />
          <Compare t="Lead exclusivity" a="Often sold to multiple pros" s="Alerts are yours; outreach is direct" />
          <Compare t="Relevance" a="Broad categories" s="Pinpoint by status, scope, zips, keywords" />
          <Compare t="Speed" a="Minutes–hours" s="Instant" />
          <Compare t="Costs" a="Pay-per-lead or high fees" s="Simple monthly add-on" />
          <Compare t="Control" a="Limited filters" s="Full rule builder" />
        </div>
      </section>

      {/* PRICING TEASER */}
      <section id="pricing" className="container-max">
        <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="flex-1">
            <div className="text-xl font-semibold text-ink dark:text-white">Start free • simple pricing later</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Pros use AirLink free. Signals is a low monthly add-on based on coverage. Cancel anytime.
            </p>
          </div>
          <div className="flex gap-2">
            <PrimaryCTA />
            <Link href="/pricing#signals" className="btn btn-outline">View pricing</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-max">
        <Testimonials />
      </section>

      {/* FAQ */}
      <section id="faq" className="container-max">
        <h3 className="text-xl font-semibold text-ink dark:text-white mb-4">FAQ</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <QA q="What data sources does Signals watch?" a="Inspections, permits, licenses and violations from participating jurisdictions. Coverage expands continuously." />
          <QA q="How fast are alerts?" a="Instant when available. Or pick a daily digest for low-noise workflows." />
          <QA q="Can I target by zip codes?" a="Yes—add lists of zips, select jurisdictions, and apply scope keywords." />
          <QA q="How is this different from marketplaces?" a="Signals surfaces demand at the source—before homeowners start shopping—so you contact first and win more often." />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-max">
        <div className="rounded-2xl bg-emerald-600 text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 shadow-soft">
          <div className="flex-1">
            <div className="text-2xl font-semibold">Own the first call in your market.</div>
            <p className="text-emerald-50/90 mt-1">Turn inspections and permits into booked jobs with zero manual work.</p>
          </div>
          <div className="flex gap-2">
            {!isSignedIn
              ? <button onClick={openAuth} className="btn bg-white text-emerald-700 hover:bg-emerald-50">Start free alerts</button>
              : <Link href="/signals/dashboard" className="btn bg-white text-emerald-700 hover:bg-emerald-50">Open dashboard</Link>}
            <Link href="/pro/signals/rules/new" className="btn btn-outline border-white/60 text-white hover:bg-white/10">Create a rule</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------- small components ---------- */

function SectionHeader({ eyebrow, title }:{ eyebrow:string; title:string }){
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-ink dark:text-white">{title}</h2>
    </div>
  )
}
function SectionNav(){
  const items = [
    {href:'#how', label:'How it works'},
    {href:'#feed', label:'Live feed'},
    {href:'#features', label:'Features'},
    {href:'#pricing', label:'Pricing'},
    {href:'#faq', label:'FAQ'},
  ]
  return (
    <div className="sticky top-[68px] z-20 bg-white/80 backdrop-blur border-y border-slate-100 dark:bg-slate-900/80 dark:border-slate-800">
      <div className="container-max">
        <nav className="flex gap-4 overflow-x-auto no-scrollbar text-sm py-2">
          {items.map(it=>(
            <a key={it.href} href={it.href} className="px-2 py-1 rounded hover:bg-emerald-50 text-slate-700 dark:text-slate-300">
              {it.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
function Stat({label, value}:{label:string; value:number|string}){
  return (
    <div className="card py-4">
      <div className="text-xl font-semibold text-ink dark:text-white">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}
function Step({n,t,d}:{n:number;t:string;d:string}){
  return (
    <div className="card p-5 text-center">
      <div className="mx-auto mb-3 h-10 w-10 grid place-items-center rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">{n}</div>
      <div className="font-semibold text-ink dark:text-white">{t}</div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{d}</p>
    </div>
  )
}
function RuleChip({label,value}:{label:string; value:string}){
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-800">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm text-ink dark:text-white truncate">{value}</div>
    </div>
  )
}
function Feature({icon,t,d}:{icon:string;t:string;d:string}){
  return (
    <div className="card p-5">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-semibold text-ink dark:text-white">{t}</div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{d}</p>
    </div>
  )
}
function Compare({t,a,s}:{t:string;a:string;s:string}){
  return (
    <div className="card p-5">
      <div className="font-semibold text-ink dark:text-white">{t}</div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
        <div><div className="badge bg-slate-100 text-slate-700">Traditional</div><p className="mt-1 text-slate-600 dark:text-slate-300">{a}</p></div>
        <div><div className="badge bg-emerald-50 text-emerald-700">Signals</div><p className="mt-1 text-slate-600 dark:text-slate-300">{s}</p></div>
      </div>
    </div>
  )
}
function QA({q,a}:{q:string;a:string}){
  return (
    <div className="card p-5">
      <div className="font-semibold text-ink dark:text-white">{q}</div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{a}</p>
    </div>
  )
}
function RoiCalc(){
  const [leads, setLeads] = useState(30)
  const [closeRate, setCloseRate] = useState(20) // %
  const [avgJob, setAvgJob] = useState(1800) // $
  const [margin, setMargin] = useState(35) // %
  const [cost, setCost] = useState(129) // $
  const revenue = leads * (closeRate/100) * avgJob
  const profit = revenue * (margin/100)
  const roi = Math.max(0, Math.round(((profit - cost) / Math.max(1,cost)) * 100))

  return (
    <div className="space-y-3">
      <Row label={`Signals/mo: ${leads}`}><input type="range" min={5} max={100} value={leads} onChange={e=>setLeads(+e.target.value)} className="w-full" /></Row>
      <Row label={`Close rate: ${closeRate}%`}><input type="range" min={5} max={60} step={1} value={closeRate} onChange={e=>setCloseRate(+e.target.value)} className="w-full" /></Row>
      <Row label={`Avg job: $${avgJob}`}><input type="range" min={300} max={8000} step={100} value={avgJob} onChange={e=>setAvgJob(+e.target.value)} className="w-full" /></Row>
      <Row label={`Margin: ${margin}%`}><input type="range" min={10} max={70} step={1} value={margin} onChange={e=>setMargin(+e.target.value)} className="w-full" /></Row>
      <Row label={`Signals add-on: $${cost}/mo`}><input type="range" min={49} max={399} step={10} value={cost} onChange={e=>setCost(+e.target.value)} className="w-full" /></Row>
      <div className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 border border-emerald-200">
        <div><span className="font-semibold">Est. monthly profit:</span> ${Math.round(profit).toLocaleString()}</div>
        <div><span className="font-semibold">ROI:</span> {roi}%</div>
      </div>
    </div>
  )
}
function Row({label, children}:{label:string; children:React.ReactNode}){
  return (
    <div>
      <div className="text-xs text-slate-600 mb-1">{label}</div>
      {children}
    </div>
  )
}
