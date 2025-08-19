'use client'
import React, { useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useApp } from '../../lib/state'
import ScopeAssistantModal from '../../components/ScopeAssistantModal'

export default function PostJob(){
  const { state, addToast } = useApp()
  const sp = useSearchParams()
  const router = useRouter()

  // prefill support (for 1-click Rehire or deep links)
  const preTitle = sp.get('title') || ''
  const preCat = sp.get('cat') || ''
  const preZip = sp.get('zip') || ''

  const [title, setTitle] = useState(preTitle)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(preCat)
  const [zip, setZip] = useState(preZip)
  const [budgetType, setBudgetType] = useState<'Hourly'|'Fixed'>('Fixed')
  const [budgetMin, setBudgetMin] = useState<number|''>('')
  const [budgetMax, setBudgetMax] = useState<number|''>('')
  const [urgency, setUrgency] = useState(5)
  const urgencyColor = useMemo(()=>{
    const g = 160 - Math.round((urgency-1)/9*160)
    const r = Math.round((urgency-1)/9*220)
    return `rgb(${r},${g},90)`
  },[urgency])

  const [openScope, setOpenScope] = useState(false)

  const submit = (e:React.FormEvent)=>{
    e.preventDefault()
    addToast('Job posted (demo)', 'info', 2000)
    router.push('/jobs')
  }

  return (
    <section className="section">
      <div className="max-w-2xl mx-auto card p-6">
        <h1 className="text-2xl font-semibold text-ink">Post a job</h1>

        <form className="mt-4 space-y-4" onSubmit={submit}>
          <div>
            <label className="label required">Title</label>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., AC not cooling" required/>
          </div>

          <div>
            <label className="label required">Category</label>
            <select className="input" value={category} onChange={e=>setCategory(e.target.value)} required>
              <option value="">Choose…</option>
              {state.categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="label required">ZIP</label>
            <input className="input" inputMode="numeric" placeholder="10001" value={zip} onChange={e=>setZip(e.target.value)} required/>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label required">Description</label>
              <button type="button" className="btn btn-outline" onClick={()=>setOpenScope(true)}>Help me describe it</button>
            </div>
            <textarea className="input min-h-[140px]" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe what’s wrong, any photos you can add, access details…"/>
          </div>

          <div>
            <label className="label">Urgency</label>
            <div className="mt-1">
              <input type="range" min={1} max={10} value={urgency} onChange={e=>setUrgency(Number(e.target.value))} className="w-full"/>
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>Low</span><span>High</span>
              </div>
              <div className="h-1 rounded-full mt-2" style={{background:`linear-gradient(90deg, #10b981, ${urgencyColor})`}}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label required">Budget Type</label>
              <select className="input" value={budgetType} onChange={e=>setBudgetType(e.target.value as any)}>
                <option>Fixed</option>
                <option>Hourly</option>
              </select>
            </div>
            <div>
              <label className="label">Budget Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input className="input" inputMode="numeric" placeholder="Min" value={budgetMin} onChange={e=>setBudgetMin(e.target.value ? Number(e.target.value) : '')}/>
                <input className="input" inputMode="numeric" placeholder="Max" value={budgetMax} onChange={e=>setBudgetMax(e.target.value ? Number(e.target.value) : '')}/>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button className="btn btn-outline" type="button" onClick={()=>history.back()}>Cancel</button>
            <button className="btn-primary" type="submit">Post job</button>
          </div>
        </form>
      </div>

      <ScopeAssistantModal
        open={openScope}
        onClose={()=>setOpenScope(false)}
        onInsert={(scope)=> setDescription((prev)=> (prev ? prev + '\n\n' : '') + scope)}
        category={category}
        description={description}
      />
    </section>
  )
}
