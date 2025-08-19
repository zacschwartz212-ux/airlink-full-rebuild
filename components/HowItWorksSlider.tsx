'use client'
import React, { useState } from 'react'

const homeowner = [
  { icon: '📝', title: 'Post your job', desc: 'Issue, ZIP, timing, and photos.' },
  { icon: '⚡', title: 'Get bids fast', desc: 'Local pros send quotes or instant estimates.' },
  { icon: '✅', title: 'Hire with confidence', desc: 'Chat, review profiles, award the job.' },
]
const contractor = [
  { icon: '🔎', title: 'See local demand', desc: 'Jobs filtered by your services and area.' },
  { icon: '📨', title: 'Bid in seconds', desc: 'Templates and rate guard for fast quotes.' },
  { icon: '📈', title: 'Signals advantage', desc: 'Live license/permit/inspection events.' },
]

export default function HowItWorksSlider(){
  const [tab, setTab] = useState<'homeowner'|'contractor'>('homeowner')
  const slides = tab==='homeowner'? homeowner: contractor

  return (
    <section className="section">
      <div className="card p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-ink text-center">How it works</h2>

        {/* Centered iOS pill */}
        <div className="mt-4 flex justify-center">
          <div className="relative w-[320px] rounded-full bg-emerald-50 ring-1 ring-emerald-200 p-1">
            {/* moving thumb */}
            <div className="absolute inset-1 pointer-events-none">
              <div
                className="h-8 rounded-full bg-white shadow-soft w-1/2 transition-transform"
                style={{ transform: tab==='homeowner' ? 'translateX(0%)' : 'translateX(100%)' }}
              />
            </div>
            {/* labels */}
            <div className="relative grid grid-cols-2 text-sm font-medium">
              <button
                className={`h-8 rounded-full z-10 ${tab==='homeowner'?'text-ink':'text-emerald-700/70'}`}
                onClick={()=>setTab('homeowner')}
              >
                Homeowner
              </button>
              <button
                className={`h-8 rounded-full z-10 ${tab==='contractor'?'text-ink':'text-emerald-700/70'}`}
                onClick={()=>setTab('contractor')}
              >
                Contractor
              </button>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {slides.map((s,i)=>(
            <div key={i} className="card p-5">
              <div className="text-3xl">{s.icon}</div>
              <div className="font-semibold mt-2">{s.title}</div>
              <p className="text-sm mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
