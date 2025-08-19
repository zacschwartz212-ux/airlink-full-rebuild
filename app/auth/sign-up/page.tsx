'use client'
import React, { useState } from 'react'
import { useApp } from '../../../lib/state'

export default function SignUp(){
  const { signIn } = useApp()
  const [name, setName] = useState('')
  const [role, setRole] = useState<'HOMEOWNER'|'CONTRACTOR'>('HOMEOWNER')

  return (
    <section className="section">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-xl font-semibold text-ink">Create account</h1>

        <label className="label mt-4">Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />

        <label className="label mt-3">Role</label>
        <select className="input" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="HOMEOWNER">Homeowner</option>
          <option value="CONTRACTOR">Contractor</option>
        </select>

        <button className="btn-primary mt-4" onClick={()=>signIn(name || 'User', role)}>Continue</button>
      </div>
    </section>
  )
}
