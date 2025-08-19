'use client'
import React from 'react'
import { useApp } from '../lib/state'

export default function Testimonials(){
  const { state } = useApp()
  const items = Array.isArray(state?.testimonials) ? state.testimonials : []

  if (items.length === 0) return null

  return (
    <section className="section">
      <h2 className="text-xl font-semibold text-ink mb-3">What pros are saying</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((t,i)=>(
          <figure key={i} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {t.name?.charAt(0) ?? '?'}
              </div>
              <div>
                <div className="font-semibold text-ink">{t.name}</div>
                <div className="text-xs text-slate-500">{t.company}</div>
              </div>
            </div>
            <blockquote className="mt-3 text-sm text-slate-700 dark:text-slate-300">
              {t.quote}
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  )
}
