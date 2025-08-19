// lib/state.tsx
'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

/* ======================= Types ======================= */
export type UserRole = 'HOMEOWNER' | 'CONTRACTOR' | null

type Message = { id: string; from: string; body: string; read?: boolean }
type Signal = {
  id: string
  title?: string
  summary?: string
  details?: string
  status?: string
  type?: string
  category?: string
  city?: string
  county?: string
  jurisdiction?: string
  zip?: string
  date?: string
  timestamp?: string | number
  scope?: string
}
type Contractor = {
  id: string
  name: string
  services: string[]
  badges: string[]
  bio?: string
  rating?: number
  airlinkScore?: number
  city?: string
  zip?: string
  serviceZips: string[]
  loc?: { lat: number; lng: number }
}
type Testimonial = { name: string; company?: string; quote: string }

export type AppState = {
  user: { signedIn: boolean; name: string; role: UserRole; signalsActive?: boolean }
  ui: { authOpen: boolean; signUpOpen: boolean }
  messages: Message[]
  signals: Signal[]
  contractors: Contractor[]
  categories: string[]
  testimonials: Testimonial[]
}

export type AppContextValue = {
  state: AppState
  // auth modals
  openAuth: () => void
  closeAuth: () => void
  openSignUp: () => void
  closeSignUp: () => void
  // auth session
  signIn: (opts?: { name?: string; role?: UserRole; signalsActive?: boolean }) => void
  signOut: () => void
  // misc
  addToast: (msg: string, type?: 'info' | 'error' | 'success') => void
  markMessagesRead: (count: number) => void
  unreadCount: number
}

/* ======================= Context ======================= */
const AppCtx = createContext<AppContextValue | null>(null)

/* Optional non-hook accessor for server utilities (no reactivity) */
let __latestCtx: AppContextValue | null = null
export function getApp(): AppContextValue | null {
  return __latestCtx
}

/* ======================= Provider ======================= */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    user: { signedIn: false, name: 'Guest', role: null, signalsActive: false },
    ui: { authOpen: false, signUpOpen: false },
    messages: [
      { id: 'm1', from: 'Lindsey', body: 'Can you swing by tomorrow between 10–12?', read: false },
      { id: 'm2', from: 'Marco (HVAC Pro)', body: 'I can source the condenser by Friday and install same-day.', read: false },
      { id: 'm3', from: 'Priya', body: 'Thanks! The roof leak is near the chimney, adding photos.', read: true },
    ],
    // IMPORTANT: static demo data (no Date.now/Math.random) to avoid SSR/CSR mismatches
    signals: STATIC_SIGNALS,
    contractors: STATIC_CONTRACTORS,
    categories: STATIC_CATEGORIES,
    testimonials: STATIC_TESTIMONIALS,
  }))

  /* ===== UI actions ===== */
  const openAuth   = useCallback(()=> setState(s=>({ ...s, ui:{...s.ui, authOpen:true  } })), [])
  const closeAuth  = useCallback(()=> setState(s=>({ ...s, ui:{...s.ui, authOpen:false } })), [])
  const openSignUp = useCallback(()=> setState(s=>({ ...s, ui:{...s.ui, signUpOpen:true } })), [])
  const closeSignUp= useCallback(()=> setState(s=>({ ...s, ui:{...s.ui, signUpOpen:false} })), [])

  /* ===== Auth session ===== */
  const signIn = useCallback((opts?: { name?: string; role?: UserRole; signalsActive?: boolean })=>{
    setState(s=>({
      ...s,
      user: {
        signedIn: true,
        name: opts?.name ?? 'Alex Contractor',
        role: opts?.role ?? 'CONTRACTOR',
        signalsActive: opts?.signalsActive ?? s.user.signalsActive ?? true,
      },
      ui: { ...s.ui, authOpen:false, signUpOpen:false },
    }))
    toast('Signed in.')
  }, [])
  const signOut = useCallback(()=>{
    setState(s=>({ ...s, user:{ signedIn:false, name:'Guest', role:null, signalsActive:false } }))
    toast('Signed out.')
  }, [])

  /* ===== Messages ===== */
  const unreadCount = useMemo(()=> state.messages.filter(m=>!m.read).length, [state.messages])
  const markMessagesRead = useCallback((count:number)=>{
    setState(s=>{
      if(count<=0) return s
      let left = count
      const msgs = s.messages.map(m=>{
        if(!m.read && left>0){ left--; return {...m, read:true} }
        return m
      })
      return { ...s, messages: msgs }
    })
  }, [])

  /* ===== Toasts ===== */
  const toast = (msg:string)=>{
    try { window.dispatchEvent(new CustomEvent('al_toast', { detail: msg })) } catch {}
    if (process.env.NODE_ENV !== 'production') console.log('[toast]', msg)
  }
  const addToast = useCallback((msg:string)=>toast(msg), [])

  const value: AppContextValue = {
    state, openAuth, closeAuth, openSignUp, closeSignUp, signIn, signOut,
    addToast, markMessagesRead, unreadCount,
  }

  // keep latest for getApp() consumers (server utilities only)
  __latestCtx = value

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

/* ======================= Consumer ======================= */
export function useApp(): AppContextValue {
  const ctx = useContext(AppCtx)
  if (!ctx) {
    throw new Error(
      "useApp must be used inside a Client Component wrapped by <AppProvider>.\n" +
      "• Add 'use client' at the top of your component file.\n" +
      '• Ensure <AppProvider> wraps your app in app/layout.tsx.\n' +
      '• Do NOT import/use useApp() in server files (API routes, lib/auth.ts, loaders).'
    )
  }
  return ctx
}

/* ======================= Static demo data ======================= */
/* Static arrays (no runtime randomness/time) to keep SSR/CSR identical */
const STATIC_CATEGORIES: string[] = [
  'Electrical','HVAC','Roofing','Plumbing','Carpentry','General','Landscaping'
]

const STATIC_CONTRACTORS: Contractor[] = [
  {
    id: 'c1',
    name: 'BrightSpark Electric',
    services: ['Electrical'],
    badges: ['Licensed', 'Insured'],
    bio: 'Residential service upgrades, panel work, EV chargers.',
    rating: 4.8,
    airlinkScore: 95,
    city: 'Brooklyn',
    zip: '11215',
    serviceZips: ['11215', '11205', '10001'],
    loc: { lat: 40.6673, lng: -73.9850 },
  },
  {
    id: 'c2',
    name: 'CoolFlow HVAC',
    services: ['HVAC'],
    badges: ['Licensed', 'EPA Certified'],
    bio: 'Mini-splits, condenser replacement, seasonal maintenance.',
    rating: 4.6,
    airlinkScore: 91,
    city: 'Manhattan',
    zip: '10001',
    serviceZips: ['10001', '10017', '10018'],
    loc: { lat: 40.7506, lng: -73.9972 },
  },
  {
    id: 'c3',
    name: 'Peak Roofing Co.',
    services: ['Roofing'],
    badges: ['Licensed', 'Insured'],
    bio: 'Asphalt shingles, flashing repair, leak diagnostics.',
    rating: 4.7,
    airlinkScore: 89,
    city: 'Queens',
    zip: '11355',
    serviceZips: ['11205', '11201', '10002'],
    loc: { lat: 40.6976, lng: -73.9713 },
  },
  {
    id: 'c4',
    name: 'Neighborhood Plumbing',
    services: ['Plumbing'],
    badges: ['Licensed'],
    bio: 'Repairs, repipes, venting corrections, water heaters.',
    rating: 4.5,
    airlinkScore: 86,
    city: 'Manhattan',
    zip: '10002',
    serviceZips: ['10002', '10017', '11201'],
    loc: { lat: 40.7170, lng: -73.9890 },
  },
  {
    id: 'c5',
    name: 'HandyWorks',
    services: ['General', 'Carpentry'],
    badges: ['Insured'],
    bio: 'Small remodels, trim carpentry, doors & windows.',
    rating: 4.3,
    airlinkScore: 82,
    city: 'Brooklyn',
    zip: '11201',
    serviceZips: ['11201', '11205', '10018'],
    loc: { lat: 40.6955, lng: -73.9890 },
  },
  {
    id: 'c6',
    name: 'GreenScape Pros',
    services: ['Landscaping'],
    badges: [],
    bio: 'Maintenance, plantings, seasonal cleanup.',
    rating: 4.1,
    airlinkScore: 78,
    city: 'Brooklyn',
    zip: '11205',
    serviceZips: ['11205', '11215', '10001'],
    loc: { lat: 40.6976, lng: -73.9713 },
  },
]

const STATIC_SIGNALS: Signal[] = [
  {
    id:'s1',
    title:'Electrical inspection failed – panel clearance',
    status:'Failed', type:'Inspection', category:'Electrical',
    city:'Brooklyn', jurisdiction:'NYC DOB', zip:'11215',
    date:'2025-08-17',
    scope:'Service panel clearance inadequate; needs relocation or clearance adjustment.',
    details:'Inspector noted obstructions within 36" clearance. Re-evaluate landing space.',
  },
  {
    id:'s2',
    title:'Roofing violation – missing flashing',
    status:'New', type:'Violation', category:'Roofing',
    city:'Queens', jurisdiction:'NYC DOB', zip:'11355',
    date:'2025-08-16',
    scope:'Chimney flashing degraded; moisture ingress suspected.',
    details:'Water stains in attic near chimney. Recommend flashing + sealing.',
  },
  {
    id:'s3',
    title:'HVAC permit issued – condenser replacement',
    status:'Issued', type:'Permit', category:'HVAC',
    city:'Jersey City', jurisdiction:'JC Building Dept', zip:'07302',
    date:'2025-08-15',
    scope:'3-ton condenser replacement; line set inspection required.',
    details:'Homeowner requested quieter unit; pad and disconnect update needed.',
  },
  {
    id:'s4',
    title:'Electrical permit applied – service upgrade',
    status:'Applied', type:'Permit', category:'Electrical',
    city:'Brooklyn', jurisdiction:'NYC DOB', zip:'11206',
    date:'2025-08-14',
    scope:'100A to 200A service upgrade; new mast & meter pan.',
    details:'Coordination with utility for cut-over; schedule rough inspection.',
  },
  {
    id:'s5',
    title:'Plumbing inspection failed – venting',
    status:'Failed', type:'Inspection', category:'Plumbing',
    city:'Manhattan', jurisdiction:'NYC DOB', zip:'10009',
    date:'2025-08-13',
    scope:'Improper trap arm length; venting correction required.',
    details:'Potential S-trap; recommend AAV or re-run vent per code.',
  },
  {
    id:'s6',
    title:'Roofing violation – exposed fasteners',
    status:'New', type:'Violation', category:'Roofing',
    city:'Queens', jurisdiction:'NYC DOB', zip:'11432',
    date:'2025-08-12',
    scope:'Exposed fasteners near ridge; seal and replace damaged shingles.',
    details:'Wind uplift risk; recommend sealing and cap replacement.',
  },
]

const STATIC_TESTIMONIALS: Testimonial[] = [
  { name:'Jordan P.', company:'Peak Roofing', quote:'Signals put us in front of homeowners before they started calling around. Closed two jobs the first week.' },
  { name:'Sam R.', company:'BrightSpark Electric', quote:'The rule builder is spot on—failed inspections in our zips only. Way less noise than marketplaces.' },
  { name:'Alyssa K.', company:'CoolFlow HVAC', quote:'Instant alerts + quick bid templates = more booked service calls. Worth it.' },
]
