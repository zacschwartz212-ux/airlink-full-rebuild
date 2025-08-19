'use client'
import React, { useState } from 'react'
import { useApp } from '../../../lib/state'

export default function IntegrationsSettings(){
  const { state, addToast } = useApp()
  const [url, setUrl] = useState(state.signalsSettings.integrations.webhookUrl || '')
  const [zap, setZap] = useState(state.signalsSettings.integrations.zapierEnabled || false)

  return (
    <section className="section">
      <h1 className="text-xl font-semibold text-ink mb-3">Integrations</h1>
      <div className="card p-4 space-y-3">
        <div>
          <label className="label">Webhook URL</label>
          <input className="input" placeholder="https://hooks.your-app.com/airlink" value={url} onChange={e=>setUrl(e.target.value)} />
          <button className="btn btn-outline mt-2" onClick={()=>addToast('Test sent (demo)')}>Send test</button>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={zap} onChange={e=>setZap(e.target.checked)} />
          <span>Enable Zapier</span>
        </label>
        <div className="flex justify-end">
          <button className="btn-primary" onClick={()=>addToast('Saved (demo)')}>Save</button>
        </div>
      </div>
    </section>
  )
}
