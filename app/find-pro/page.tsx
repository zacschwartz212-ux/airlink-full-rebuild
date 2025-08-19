// app/find-pro/page.tsx  (or pages/find-pro.tsx)
// Drop-in replacement for your /find-pro page.
// Two-row header. Availability removed. Hours of Operation = multi-select popover (click-out + high z-index).
// Right side of row 2: Top Rated • Hours of operation • Emergency.
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import ProMapInner from '@/components/ProMapInner'
import { useApp } from '@/lib/state'

type LatLng = [number, number]
type HoursTag = 'open_now' | 'open_today' | 'weekends' | 'evenings' | 'early_morning' | '24_7'

/* Keep in sync with ProMapInner categories */
const CAT_EMOJI: Record<string, string> = {
  Electrical: '⚡',
  HVAC: '❄️',
  Roofing: '🏠',
  Plumbing: '🚿',
  Carpentry: '🪚',
  General: '🧰',
  Landscaping: '🌿',
}

/* Optional ZIP presets (fast, no geocoding) */
const ZIP_COORDS: Record<string, LatLng> = {
  '10001': [40.7506, -73.9972],
  '10002': [40.717, -73.989],
  '10017': [40.7522, -73.9725],
  '10018': [40.7557, -73.9925],
  '11201': [40.6955, -73.989],
  '11205': [40.6976, -73.9713],
  '11215': [40.6673, -73.985],
}

export default function FindProPage() {
  const { state } = useApp()
  const allContractors: any[] = Array.isArray((state as any)?.contractors)
    ? (state as any).contractors
    : []

  // Top bar — line 1
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [service, setService] = useState<keyof typeof CAT_EMOJI | ''>('')

  // Top bar — line 2 (filters)
  const [radius, setRadius] = useState(15) // miles
  const [minRating, setMinRating] = useState(0)
  const [minYears, setMinYears] = useState(0) // 0,3,5,10
  const [emergencyOnly, setEmergencyOnly] = useState(false) // primary pill
  const [hoursTags, setHoursTags] = useState<HoursTag[]>([]) // multi-select

  // Map + ZIP
  const [center, setCenter] = useState<LatLng>([40.7128, -74.006])
  const [zip, setZip] = useState('')

  // Results sort (BELOW the map)
  const [sort, setSort] = useState<'best' | 'distance' | 'rating' | 'experience'>('best')

  // Debounce query so typing is smooth
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 140)
    return () => clearTimeout(t)
  }, [query])

  // Auto-center when a known 5-digit ZIP is typed
  useEffect(() => {
    const z = zip.trim()
    if (z.length === 5 && ZIP_COORDS[z]) setCenter(ZIP_COORDS[z])
  }, [zip])

  const activeCenter = center

  // Distance helper
  function distMiles(a: LatLng, b: LatLng) {
    const toRad = (d: number) => (d * Math.PI) / 180
    const R = 3958.8
    const dLat = toRad(b[0] - a[0])
    const dLng = toRad(b[1] - a[1])
    const s1 = Math.sin(dLat / 2)
    const s2 = Math.sin(dLng / 2)
    const t = s1 * s1 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * s2 * s2
    const c = 2 * Math.atan2(Math.sqrt(t), Math.sqrt(1 - t))
    return R * c
  }

  // Hours matching — STRICT when selected: require affirmative data to match
  function matchesHours(c: any): boolean {
    if (!hoursTags.length) return true
    const h = c?.hours || {}
    const weekend = h.weekend === true || c?.weekendAvailable === true
    const evenings = h.evenings === true || c?.eveningAvailable === true
    const early = h.early === true || c?.earlyMorning === true
    const openNow = h.openNow === true || c?.openNow === true
    const openToday = h.openToday === true || c?.openToday === true
    const is247 = c?.twentyFourSeven === true || c?.['24_7'] === true

    for (const tag of hoursTags) {
      if (tag === 'weekends' && !weekend) return false
      if (tag === 'evenings' && !evenings) return false
      if (tag === 'early_morning' && !early) return false
      if (tag === 'open_now' && !openNow) return false
      if (tag === 'open_today' && !openToday) return false
      if (tag === '24_7' && !is247) return false
    }
    return true
  }

  // Filter + sort
  const filtered = useMemo(() => {
    const q = debouncedQuery

    let items = allContractors
      .map(c => ({ ...c })) // do not mutate store
      .filter(c => {
        const name = String(c?.name || '').toLowerCase()
        const city = String(c?.city || '').toLowerCase()
        const services: string[] = Array.isArray(c?.services) ? c.services : []
        const rating = Number(c?.rating) || 0
        const years = Number(c?.years) || 0

        // service filter (dropdown)
        if (service && !services.includes(service as string)) return false

        // text search (name/city/services)
        if (q) {
          const hay = `${name} ${city} ${services.join(' ')}`.toLowerCase()
          if (!hay.includes(q)) return false
        }

        // rating / experience
        if (minRating > 0 && rating < minRating) return false
        if (minYears > 0 && years < minYears) return false

        // emergency (primary) — if required, must be explicitly available
        if (emergencyOnly) {
          const emerg = c?.emergency === true || c?.emergencyService === true || c?.['24_7'] === true
          if (!emerg) return false
        }

        // hours multi-select
        if (!matchesHours(c)) return false

        // location + distance
        const lat = Number(c?.loc?.lat)
        const lng = Number(c?.loc?.lng)
        if (!isFinite(lat) || !isFinite(lng)) return false

        const d = distMiles(activeCenter, [lat, lng])
        ;(c as any).__distance = d
        if (d > radius) return false

        return true
      })

    // Sort
    if (sort === 'distance') {
      items.sort((a, b) => (a.__distance ?? 1e9) - (b.__distance ?? 1e9))
    } else if (sort === 'rating') {
      items.sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
    } else if (sort === 'experience') {
      items.sort((a, b) => (Number(b?.years) || 0) - (Number(a?.years) || 0))
    } else {
      // best = rating desc, then distance asc
      items.sort((a, b) => {
        const r = (Number(b?.rating) || 0) - (Number(a?.rating) || 0)
        if (r !== 0) return r
        return (a.__distance ?? 1e9) - (b.__distance ?? 1e9)
      })
    }

    return items
  }, [
    allContractors,
    debouncedQuery,
    service,
    minRating,
    minYears,
    emergencyOnly,
    hoursTags,
    radius,
    sort,
    activeCenter,
  ])

  function resetAll() {
    setQuery('')
    setService('')
    setRadius(15)
    setMinRating(0)
    setMinYears(0)
    setEmergencyOnly(false)
    setHoursTags([])
    setZip('') // keep map center sticky
  }

  return (
    <section className="mx-auto max-w-6xl space-y-3 px-3 py-3">
      {/* TOP BAR — TWO ROWS (fixed) */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
        {/* LINE 1: Search • Service • ZIP • Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[220px] grow">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name, city, or service"
              className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-[13px] outline-none transition focus:border-emerald-400"
            />
          </div>

          <select
            value={service}
            onChange={e => setService(e.target.value as any)}
            className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-[13px]"
            title="Service"
          >
            <option value="">All services</option>
            {Object.keys(CAT_EMOJI).map(k => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <input
            value={zip}
            onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="ZIP"
            maxLength={5}
            className="w-[78px] rounded-xl border border-slate-200 px-2.5 py-1.5 text-[13px] outline-none transition focus:border-emerald-400"
          />

          <button
            onClick={resetAll}
            className="ml-auto rounded-xl border border-slate-200 px-2.5 py-1.5 text-[13px] hover:bg-slate-50"
            title="Reset filters"
          >
            Reset
          </button>
        </div>

        {/* LINE 2: Left (Radius/Rating/Experience) • Right (Top Rated • Hours • Emergency) */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {/* LEFT GROUP */}
          <div className="flex min-w-0 items-center gap-2 grow">
            {/* Radius */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Radius</span>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="accent-emerald-500"
              />
              <div className="w-12 text-right text-[11px] text-slate-700">{radius} mi</div>
            </div>

            {/* Min rating + Experience */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Min rating</span>
              <select
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-[13px]"
              >
                <option value={0}>Any</option>
                <option value={3}>3.0+</option>
                <option value={3.5}>3.5+</option>
                <option value={4}>4.0+</option>
                <option value={4.5}>4.5+</option>
              </select>

              <span className="ml-1 text-[11px] text-slate-500">Experience</span>
              <select
                value={minYears}
                onChange={e => setMinYears(Number(e.target.value))}
                className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-[13px]"
                title="Minimum years in business"
              >
                <option value={0}>Any</option>
                <option value={3}>3+ yrs</option>
                <option value={5}>5+ yrs</option>
                <option value={10}>10+ yrs</option>
              </select>
            </div>
          </div>

          {/* RIGHT GROUP: Top Rated • Hours popover • Emergency */}
          <div className="ml-auto flex items-center gap-2">
            {/* Top Rated pill */}
            {(() => {
              const topActive = minRating >= 4.5
              return (
                <button
                  onClick={() => setMinRating(topActive ? 0 : 4.5)}
                  className={
                    'rounded-full px-3 py-1.5 text-[12px] font-medium transition ' +
                    (topActive
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100')
                  }
                  title="Only show 4.5★ and up"
                >
                  ★ Top rated
                </button>
              )
            })()}

            {/* Hours of operation — DROPDOWN POPOVER (multi) */}
            {(() => {
              const OPTIONS: { value: HoursTag; label: string }[] = [
                { value: 'open_now', label: 'Open now' },
                { value: 'open_today', label: 'Open today' },
                { value: 'weekends', label: 'Open weekends' },
                { value: 'evenings', label: 'Evenings' },
                { value: 'early_morning', label: 'Early morning' },
                { value: '24_7', label: '24/7' },
              ]
              const pretty = (t: HoursTag) => OPTIONS.find(o => o.value === t)?.label ?? t
              const summaryText = hoursTags.length
                ? `Hours: ${hoursTags.map(pretty).join(', ')}`
                : 'Hours: Any'
              const toggle = (tag: HoursTag) => {
                setHoursTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
              }

              return (
                <details className="relative">
                  <summary className="inline-flex select-none items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] leading-none text-slate-800 hover:bg-slate-50 cursor-pointer">
                    <span className="truncate max-w-[220px]">{summaryText}</span>
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 opacity-60">
                      <path d="M5.5 7.5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </summary>

                  {/* Outside-click overlay to close */}
                  <button
                    type="button"
                    aria-hidden="true"
                    className="fixed inset-0 z-[2500] cursor-default bg-transparent"
                    onClick={(e) => {
                      e.preventDefault()
                      ;(e.currentTarget.closest('details') as HTMLDetailsElement)?.removeAttribute('open')
                    }}
                  />

                  {/* Popover menu — high z-index so it's above map controls */}
                  <div className="absolute right-0 z-[3000] mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <button
                      className="w-full rounded-lg px-2 py-1.5 text-left text-[13px] hover:bg-slate-50"
                      onClick={(e) => {
                        e.preventDefault()
                        setHoursTags([])
                        ;(e.currentTarget.closest('details') as HTMLDetailsElement)?.removeAttribute('open')
                      }}
                    >
                      Any
                    </button>
                    <div className="my-1 h-px bg-slate-100" />
                    <div className="max-h-48 overflow-auto pr-1">
                      {OPTIONS.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] hover:bg-slate-50">
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-slate-300 accent-emerald-500"
                            checked={hoursTags.includes(opt.value)}
                            onChange={() => toggle(opt.value)}
                          />
                          <span className="text-slate-800">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </details>
              )
            })()}

            {/* Emergency primary pill on the far right */}
            <button
              onClick={() => setEmergencyOnly(v => !v)}
              className={
                'rounded-full px-3 py-1.5 text-[12px] font-medium ' +
                (emergencyOnly
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100')
              }
              title="Emergency service"
            >
              🚨 Emergency
            </button>
          </div>
        </div>
      </div>

      {/* Category chips — tight, text-only */}
      <div className="no-scrollbar -mx-1 flex snap-x items-center gap-1.5 overflow-x-auto px-1">
        {Object.keys(CAT_EMOJI).map((label) => {
          const active = service === label
          return (
            <button
              key={label}
              onClick={() => setService(active ? '' : (label as any))}
              className={
                'snap-start inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] ' +
                (active
                  ? 'border-emerald-500/70 bg-emerald-50 font-medium text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')
              }
              title={label}
            >
              <span className="leading-none">{label}</span>
            </button>
          )
        })}
        <button
          onClick={() => setService('')}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[12px] text-slate-700 hover:bg-slate-50"
        >
          Clear
        </button>
      </div>

      {/* Map */}
      <ProMapInner
        items={filtered}
        category={service || undefined}
        radiusMiles={radius}
        searchCenter={activeCenter}
        onSearchHere={(c) => setCenter(c)} // sticky center from "Search this area"
      />

      {/* Results header (BELOW map) with Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[12px] text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filtered.length}</span> within{' '}
          <span className="font-semibold text-slate-900">{radius} mi</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-slate-500">Sort</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as any)}
            className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-[13px]"
            title="Sort results"
          >
            <option value="best">Best match</option>
            <option value="distance">Distance</option>
            <option value="rating">Rating</option>
            <option value="experience">Experience</option>
          </select>
        </div>
      </div>

      {/* Results list — ALWAYS visible. Tight, premium cards with text-only specialties. */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const d = (c as any).__distance as number | undefined
            const services: string[] = Array.isArray(c?.services) ? c.services : []
            return (
              <div
                key={String(c?.id ?? c?.name)}
                className="rounded-xl border border-slate-200 p-2.5 transition hover:shadow-[0_1px_12px_rgba(2,6,23,.06)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate text-[14px] font-semibold text-slate-900">
                    {c?.name || 'Contractor'}
                  </div>
                  <div className="shrink-0 text-[11px] text-slate-500">
                    {typeof d === 'number' ? `${d.toFixed(1)} mi` : ''}
                  </div>
                </div>

                <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                  {c?.city ? c.city : ''}
                  {c?.rating ? ` • ★ ${Number(c.rating).toFixed(1)}` : ''}
                  {Number(c?.years) ? ` • ${Number(c.years)} yrs` : ''}
                  {c?.emergency || c?.emergencyService ? ' • 🚨 Emergency' : ''}
                  {c?.twentyFourSeven || c?.['24_7'] ? ' • 24/7' : ''}
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {services.slice(0, 5).map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-2.5 flex gap-1.5">
                  <a
                    href={`/pro/${encodeURIComponent(String(c?.id ?? ''))}`}
                    className="rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[12px] font-semibold text-white"
                  >
                    View
                  </a>
                  <a
                    href={`/messages?to=${encodeURIComponent(String(c?.id ?? ''))}`}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-900"
                  >
                    Message
                  </a>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
              No results. Widen the radius or clear filters.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
