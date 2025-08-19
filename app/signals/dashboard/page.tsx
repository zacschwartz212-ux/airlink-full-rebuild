'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useApp } from '../../../lib/state'
import SignalsCard from '../../../components/SignalsCard'

export default function SignalsDashboard(){
  const { state, markSignalsSeen } = useApp()
  const [q, setQ] = useState('')
  const [type, setType] = useState<'ALL'|'INSPECTION'|'PERMIT'|'LICENSE'|'VIOLATION'>('ALL')
  const [juris, setJuris] = useState<'ALL'|string>('ALL')

  // mark events as seen when arriving here
  useEffect(()=>{ markSignalsSeen() }, [markSignalsSeen])

  // build jurisdictions from data
  const jurisdictions = useMemo(()=>{
    const set = new Set(state.signals.map(s => s.jurisdiction).filter(Boolean))
    return ['ALL', ...Array.from(set)]
  }, [state.signals])

  // apply filters
  const list = useMemo(()=>{
    let arr = [...state.signals]
    if (type !== 'ALL') arr = arr.filter(s => s.type === type)
    if (juris !== 'ALL') arr = arr.filter(s => s.jurisdiction === juris)
    if (q) {
      const qq = q.toLowerCase()
      arr = arr.filter(s =>
        s.subject.toLowerCase().includes(qq) ||
        (s.address||'').toLowerCase().includes(qq) ||
        s.status.toLowerCase().includes(qq)
      )
    }
    arr.sort((a,b) => (b.occurredAt || '').localeCompare(a.occurredAt || ''))
    return arr
  }, [state.signals, q, type, juris])

  // count new since last visit
  const newSince = useMemo(()=>{
    if(!state.ui.lastSignalsSeenAt) return state.signals.length
    return state.signals.filter(s => s.occurredAt > state.ui.lastSignalsSeenAt!).length
  }, [state.signals, state.ui.lastSignalsSeenAt])

  // export CSV of current view
  const exportCSV = ()=>{
    const rows = [
      ['Type','Status','Subject','Jurisdiction','Address','Scope','Occurred At'],
      ...list.map(s => [
        s.type, s.status, s.subject, s.jurisdiction, s.address||'',
        (s.scope||[]).join('|'), s.occurredAt
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'airlink-signals.csv'; a.click(); URL.revokeObjectURL(url)
  }

  const reset = ()=>{ setQ(''); setType('ALL'); setJuris('ALL') }

  return (
    <div className="space-y-4">
      {/* Sticky subheader */}
      <div className="sticky top-[64px] md:top-[68px] z-20 bg-white/85 backdrop-blur border-b border-slate-100">
        <div className="container-max py-3 flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold text-ink">Signals Feed</h1>
          <span className="badge">New since last visit: {newSince}</span>
          <span className="badge">Showing: {list.length}</span>
          <div className="ml-auto flex gap-2">
            <Link href="/pro/signals/rules/new" className="btn btn-outline">Create rule</Link>
            <button className="btn-primary" onClick={exportCSV}>Export CSV</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="section">
        <div className="card p-4 grid md:grid-cols-5 gap-2">
          <input
            className="input md:col-span-2"
            placeholder="Search subject, address, or status"
            value={q}
            onChange={e=>setQ(e.target.value)}
          />
          <select className="input" value={type} onChange={e=>setType(e.target.value as any)}>
            <option value="ALL">All events</option>
            <option value="INSPECTION">Inspection</option>
            <option value="PERMIT">Permit</option>
            <option value="LICENSE">License</option>
            <option value="VIOLATION">Violation</option>
          </select>
          <select className="input" value={juris} onChange={e=>setJuris(e.target.value as any)}>
            {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          <button className="btn btn-outline" onClick={reset}>Reset</button>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {list.map(s => <SignalsCard key={s.id} s={s} />)}
        </div>
        {list.length===0 && (
          <div className="card p-6 text-center text-slate-600 mt-4">No events match your filters.</div>
        )}
      </section>
    </div>
  )
}
