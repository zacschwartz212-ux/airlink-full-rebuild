'use client'
import React, { useState } from 'react'
import { SignalEvent, useApp } from '../lib/state'
import QuickBidModal from './QuickBidModal'

export default function SignalsCard({ s }:{ s: SignalEvent }){
  const { state } = useApp()
  const [open, setOpen] = useState(false)

  const defaultCat =
    s.scope?.find(x=>/HVAC|Plumb|Electric|Roof/i.test(x)) ||
    (s.subject.match(/HVAC|Plumb|Electric|Roof/i)?.[0] || 'HVAC')

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-600">{s.jurisdiction} • {s.type}</div>
          <div className="font-semibold text-ink">{s.subject}</div>
          {s.address && <div className="text-sm text-slate-700">{s.address}</div>}
        </div>
        <span className="badge">{s.status}</span>
      </div>
      {s.scope && <div className="text-xs text-slate-600 mt-2">Scope: {s.scope.join(', ')}</div>}
      <div className="mt-3 flex gap-2">
        <button className="btn btn-outline">Claim</button>
        <button className="btn-primary" onClick={()=>setOpen(true)}>Quick bid</button>
      </div>

      <QuickBidModal open={open} onClose={()=>setOpen(false)} jobId={'j1'} category={defaultCat}/>
    </div>
  )
}
