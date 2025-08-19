'use client'
import React, { useEffect } from 'react'
import { useApp } from '@/lib/state'

export default function Toaster(){
  const { state, removeToast } = useApp()
  const toasts = state.toasts || []

  useEffect(()=>{
    const timers = toasts.map(t => setTimeout(()=>removeToast(t.id), t.ttl ?? 3000))
    return ()=>{ timers.forEach(clearTimeout) }
  }, [toasts, removeToast])

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className="rounded-xl px-4 py-3 text-sm shadow-soft"
             style={{background: t.type==='error' ? '#fee2e2' : '#ecfdf5', color: t.type==='error' ? '#991b1b' : '#065f46'}}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}
