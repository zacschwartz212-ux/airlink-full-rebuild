'use client'
import React from 'react'
import { useApp } from '../../lib/state'

export default function Messages(){
  const { state } = useApp()
  return (
    <section className="section">
      <div className="card p-6">
        <h1 className="text-xl font-semibold text-ink">Messages</h1>
        <div className="mt-4 space-y-3">
          {state.messages.map(m => (
            <div key={m.id} className="rounded-xl border border-slate-100 p-3">
              <div className="text-sm font-medium">{m.from}</div>
              <div className="text-sm text-slate-700">{m.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
