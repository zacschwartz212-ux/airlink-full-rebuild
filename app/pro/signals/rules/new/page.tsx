'use client'
import React, { useMemo, useState } from 'react'
import { useApp } from '../../../../../lib/state'

type TypeKey = 'INSPECTION'|'PERMIT'|'LICENSE'|'VIOLATION'
type Clause = { field:'subject'|'address'|'scope'|'jurisdiction'; op:'contains'|'equals'; value:string }
type Group = { logic:'AND'|'OR'; clauses: Clause[] }

export default function SignalsRuleNew(){
  const { state, addToast } = useApp()
  const [types, setTypes] = useState<TypeKey[]>(['INSPECTION','PERMIT'])
  const [groups, setGroups] = useState<Group[]>([{ logic:'AND', clauses:[{ field:'subject', op:'contains', value:'' }] }])

  const previewCount = useMemo(()=>{
    // very light preview filter against current signals
    const match = (s:any)=>{
      const typeOk = types.includes(s.type)
      const groupsOk = groups.every(g=>{
        const res = g.clauses.map(c=>{
          const hay = (String(s[c.field] || '')).toLowerCase()
          const val = c.value.toLowerCase()
          return c.op==='contains' ? hay.includes(val) : hay===val
        })
        return g.logic==='AND' ? res.every(Boolean) : res.some(Boolean)
      })
      return typeOk && groupsOk
    }
    return state.signals.filter(match).length
  }, [state.signals, types, groups])

  const addClause = (gi:number)=> setGroups(gs => {
    const copy = [...gs]; copy[gi].clauses.push({ field:'subject', op:'contains', value:'' }); return copy
  })
  const addGroup = ()=> setGroups(gs => [...gs, { logic:'OR', clauses:[{ field:'subject', op:'contains', value:'' }] }])

  return (
    <section className="section">
      <h1 className="text-xl font-semibold text-ink mb-3">Create Signals rule</h1>
      <div className="card p-4 space-y-4">
        <div>
          <div className="label">Event types</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {(['INSPECTION','PERMIT','LICENSE','VIOLATION'] as TypeKey[]).map(t=>(
              <button key={t} onClick={()=>{
                setTypes(arr => arr.includes(t) ? arr.filter(x=>x!==t) : [...arr, t])
              }} className={`px-3 py-1 rounded-full border ${types.includes(t)?'bg-emerald-600 text-white border-emerald-600':'border-slate-300 hover:bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {groups.map((g,gi)=>(
          <div key={gi} className="rounded-xl border border-slate-200 p-3">
            <div className="text-xs mb-2">Group {gi+1} — <span className="font-medium">{g.logic}</span></div>
            {g.clauses.map((c,ci)=>(
              <div key={ci} className="grid md:grid-cols-3 gap-2 mb-2">
                <select className="input" value={c.field} onChange={e=>{
                  const v = e.target.value as Clause['field']
                  setGroups(gs=>{ const copy=[...gs]; copy[gi].clauses[ci].field=v; return copy })
                }}>
                  <option value="subject">Subject</option>
                  <option value="address">Address</option>
                  <option value="scope">Scope</option>
                  <option value="jurisdiction">Jurisdiction</option>
                </select>
                <select className="input" value={c.op} onChange={e=>{
                  const v = e.target.value as Clause['op']
                  setGroups(gs=>{ const copy=[...gs]; copy[gi].clauses[ci].op=v; return copy })
                }}>
                  <option value="contains">contains</option>
                  <option value="equals">equals</option>
                </select>
                <input className="input" placeholder="value…" value={c.value} onChange={e=>{
                  const v = e.target.value
                  setGroups(gs=>{ const copy=[...gs]; copy[gi].clauses[ci].value=v; return copy })
                }}/>
              </div>
            ))}
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={()=>addClause(gi)}>+ Clause</button>
              <select className="input w-auto" value={g.logic} onChange={e=>{
                const v = e.target.value as Group['logic']
                setGroups(gs=>{ const copy=[...gs]; copy[gi].logic=v; return copy })
              }}>
                <option>AND</option><option>OR</option>
              </select>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button className="btn btn-outline" onClick={addGroup}>+ Group</button>
          <div className="text-sm">Preview matches: <span className="font-semibold">{previewCount}</span></div>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary" onClick={()=>addToast('Rule saved (demo)')}>Create rule</button>
        </div>
      </div>
    </section>
  )
}
