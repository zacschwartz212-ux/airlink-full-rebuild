'use client'
import React, { useState } from 'react'
import { useApp } from '../../../lib/state'

export default function ServiceAreaSettings(){
  const { state, addToast } = useApp()
  const [zips, setZips] = useState(state.contractorProfile.serviceZips.join(', '))
  const [fee, setFee] = useState<number|''>(state.contractorProfile.travelFee || '')

  return (
    <section className="section">
      <h1 className="text-xl font-semibold text-ink mb-3">Service area & travel</h1>
      <div className="card p-4">
        <label className="label">ZIP codes (comma separated)</label>
        <input className="input" value={zips} onChange={e=>setZips(e.target.value)} />
        <label className="label mt-3">Travel fee (optional)</label>
        <input className="input" inputMode="numeric" value={fee} onChange={e=>setFee(e.target.value?Number(e.target.value):'')}/>
        <div className="mt-3 flex justify-end">
          <button className="btn-primary" onClick={()=>addToast('Saved (demo)')}>Save</button>
        </div>
      </div>
    </section>
  )
}
