'use client'
import React from 'react'
import { useApp } from '../../../lib/state'

const STAGES = ['New','Quoted','Won','Lost'] as const

export default function LeadsKanban(){
  const { state, moveLead } = useApp()

  return (
    <section className="section">
      <h1 className="text-xl font-semibold text-ink mb-3">Lead inbox</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {STAGES.map(stage=>(
          <div key={stage} className="card p-3">
            <div className="font-medium mb-2">{stage}</div>
            <div className="space-y-2 min-h-[160px]">
              {state.leads.filter(l=>l.stage===stage).map(l=>(
                <div key={l.id} className="rounded-xl border border-slate-200 p-3 bg-white">
                  <div className="font-medium">{l.title}</div>
                  <div className="text-xs text-slate-600">ZIP {l.zip} • ${l.budget ?? '—'}</div>
                  <div className="mt-2 flex gap-2">
                    {STAGES.filter(s=>s!==stage).map(s=>
                      <button key={s} className="btn btn-outline" onClick={()=>moveLead(l.id, s)}>→ {s}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
