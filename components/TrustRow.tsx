'use client'
import React from 'react'

export default function TrustRow(){
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-700">
      <Badge icon={
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/><path d="M9 12l2 2 4-4"/>
        </svg>
      }>Licensed & Insured</Badge>

      <Badge icon={
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>
        </svg>
      }>Background-checked pros</Badge>

      <Badge icon={
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 5h18M3 12h18M3 19h18"/>
        </svg>
      }>Clear, upfront bids</Badge>

      <Badge icon={
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16v12H5.17L4 17.17V4z"/><path d="M8 8h8M8 12h6"/>
        </svg>
      }>Fast messaging</Badge>
    </div>
  )
}

function Badge({ icon, children }:{ icon:React.ReactNode; children:React.ReactNode }){
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-soft">
      <span className="text-slate-700">{icon}</span>
      <span className="text-slate-700">{children}</span>
    </span>
  )
}
