// components/Header.tsx
'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '../lib/state'
import { openAuth as openAuthModal } from '@/components/AuthModal'


function BellIcon(props:any){ return (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
    <path d="M9 17a3 3 0 0 0 6 0" />
  </svg>
)}
function ChevronDown(props:any){ return (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)}
function MenuIcon(props:any){ return (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>) }

export default function Header(){
  const { state, openAuth, openSignUp, signOut, unreadCount, markMessagesRead } = useApp() as any
  const router = useRouter()
  const pathname = usePathname()

  // Hover menus with close delay
  const [openFindPro, setOpenFindPro] = useState(false)
  const [openFindWork, setOpenFindWork] = useState(false)
  const closeTimerFindPro = useRef<number | null>(null)
  const closeTimerFindWork = useRef<number | null>(null)

  // Popovers (messages + user)
  const [showMsgs, setShowMsgs] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const msgsRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const onClick = (e:MouseEvent)=>{
      const t = e.target as Node
      if (msgsRef.current && !msgsRef.current.contains(t)) setShowMsgs(false)
      if (userRef.current && !userRef.current.contains(t)) setShowUser(false)
    }
    document.addEventListener('click', onClick)
    return ()=>document.removeEventListener('click', onClick)
  },[])

  useEffect(()=>{ if (showMsgs) markMessagesRead?.(3) }, [showMsgs, markMessagesRead])

  const isActive = (href:string) => pathname === href || (href !== '/' && pathname.startsWith(href))
  const onPost = ()=> state.user.signedIn ? router.push('/post-job') : openAuth?.()

  const NavA = ({ href, children }:{ href:string; children:React.ReactNode }) => (
    <Link
      href={href}
      className={`relative hover:text-ink dark:hover:text-white pb-1 ${
        isActive(href) ? 'text-brand font-semibold' : 'text-slate-700 dark:text-slate-200'
      }`}
    >
      <span>{children}</span>
      <span className={`absolute left-0 -bottom-[3px] h-[2px] rounded ${isActive(href)?'w-full bg-brand':'w-0 bg-transparent'} transition-all`} />
    </Link>
  )

  function HoverDrop({
    label, open, setOpen, items, active, which
  }: {
    label:string
    open:boolean
    setOpen:(v:boolean)=>void
    active?:boolean
    which:'pro'|'work'
    items:{ label:string; href?:string; onClick?:()=>void }[]
  }){
    const startClose = ()=>{
      const timerRef = which==='pro' ? closeTimerFindPro : closeTimerFindWork
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(()=>setOpen(false), 160) as any
    }
    const cancelClose = ()=>{
      const timerRef = which==='pro' ? closeTimerFindPro : closeTimerFindWork
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
    return (
      <div className="relative" onMouseEnter={()=>{ cancelClose(); setOpen(true) }} onMouseLeave={startClose}>
        <button
          className={`pb-1 hover:text-ink dark:hover:text-white ${active?'text-brand font-semibold':'text-slate-700 dark:text-slate-200'}`}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {label}
          <span className={`ml-1 inline-block transition-transform ${open?'rotate-180':''}`}>▾</span>
        </button>
        {open && (
          <div
            className="absolute left-0 top-8 z-40 card p-2 w-64 shadow-soft"
            onMouseEnter={cancelClose}
            onMouseLeave={startClose}
          >
            {items.map((it,i)=>(
              <button
                key={i}
                onClick={()=>{
                  setOpen(false)
                  if (it.href) router.push(it.href)
                  else it.onClick?.()
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                role="menuitem"
              >
                {it.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ===== Menus ===== */
  const findProItems = [
    { label:'Post a Job', onClick:onPost },
    { label:'Search for a Pro', href:'/find-pro' },
    { label:'How it Works', href:'/how-it-works' },
  ]

  // We intentionally DO NOT include '/dashboard' in findWorkActive so the label isn't lit on dashboard
  const findWorkItems = [
    { label:'Browse Jobs', href:'/jobs' },
    // keep contractor dashboard available via user menu + top-level Dashboard
    { label:'How it Works (for Pros)', href:'/find-work/how-it-works' },
    { label:'Signals ★', href:'/signals' },
  ]

  const findProActive = ['/post-job','/find-pro','/how-it-works'].some(isActive)
  const findWorkActive = ['/jobs','/signals','/find-work/how-it-works'].some(isActive)

  /* ===== User dropdown items ===== */
  const userMenu = [
    ...(state.user.signedIn ? [{ label:'Dashboard', href:'/dashboard' }] : []),
    { label:'Account', href:'/account' }, // Account portal (settings inside)
    { label:'Job History', href:'/history' },
    { label:'Post a Job', onClick:onPost },
    { label:'Sign Out', onClick:()=>{ setShowUser(false); signOut?.() } },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-100 dark:bg-slate-900/85 dark:border-slate-800">
      <div className="container-max py-3 flex items-center gap-4">
        {/* Brand — text wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/airlink-logo-text.png" alt="AirLink" className="h-6 md:h-7" />
        </Link>

        {/* Center nav */}
        <nav className="ml-6 hidden md:flex items-center gap-6">
          <NavA href="/">Home</NavA>
          <HoverDrop label="Find a Pro" which="pro" open={openFindPro} setOpen={setOpenFindPro} items={findProItems} active={findProActive}/>
          <HoverDrop label="Find Work" which="work" open={openFindWork} setOpen={setOpenFindWork} items={findWorkItems} active={findWorkActive}/>
          <NavA href="/about">About</NavA>
          <NavA href="/pricing">Pricing</NavA>

          {/* Top-level Dashboard (signed-in only) */}
          {state.user.signedIn && <NavA href="/dashboard">Dashboard</NavA>}

          <NavA href="/signals">Signals</NavA>
        </nav>

        {/* Right: Messages + Name ▾ */}
        <div className="ml-auto flex items-center gap-2">
          {!state.user.signedIn ? (
            <>
              {/* Sign up opens modal if available; fallback link otherwise */}
              <button
  onClick={() => openAuthModal('signup')}
  className="btn btn-outline hidden sm:inline-flex"
>
  Sign up
</button>

<button className="btn-primary" onClick={() => openAuthModal('signin')}>Sign in</button>

            </>
          ) : (
            <>
              {/* Messages */}
              <div className="relative" ref={msgsRef}>
                <button className="relative btn btn-outline" onClick={()=>setShowMsgs(v=>!v)} aria-label="Messages">
                  <BellIcon />
                  {unreadCount>0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {unreadCount>9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {showMsgs && (
                  <div className="absolute right-0 top-12 w-80 card p-3">
                    <div className="text-sm font-semibold text-ink dark:text-white px-1">Recent messages</div>
                    <div className="mt-2 space-y-2 max-h-64 overflow-auto">
                      {state.messages.slice(0,3).map((m:any)=>(
                        <div key={m.id} className="rounded-lg border border-slate-100 dark:border-slate-800 p-2">
                          <div className="text-sm font-medium text-ink dark:text-white">{m.from}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{m.body}</div>
                        </div>
                      ))}
                    </div>
                    <Link href="/messages" className="btn-primary w-full mt-3 text-center">View all messages</Link>
                  </div>
                )}
              </div>

              {/* Name + caret */}
              <div className="relative" ref={userRef}>
                <button
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-ink dark:text-white text-sm inline-flex items-center gap-1"
                  onClick={()=>setShowUser(v=>!v)}
                  aria-haspopup="menu"
                  aria-expanded={showUser}
                >
                  {state.user.name}
                  <ChevronDown />
                </button>
                {showUser && (
                  <div className="absolute right-0 top-12 w-64 card p-2">
                    {userMenu.map((it,i)=>(
                      <button
                        key={i}
                        onClick={()=>{
                          setShowUser(false)
                          if (it.href) router.push(it.href)
                          else it.onClick?.()
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                        role="menuitem"
                      >
                        {it.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* (Optional) Mobile toggle */}
          <button className="md:hidden ml-1 btn btn-outline" onClick={()=>{}} aria-label="Toggle menu">
            <MenuIcon/>
          </button>
        </div>
      </div>
    </header>
  )
}
