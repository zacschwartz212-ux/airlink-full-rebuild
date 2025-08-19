// components/ProMapInner.tsx
'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { useApp } from '../lib/state'

type Props = {
  category?: string
  centerZip?: string
  radiusMiles?: number
  searchCenter?: [number, number]
  onSearchHere?: (center: [number, number]) => void
}

const ZIP_COORDS: Record<string, [number, number]> = {
  '10001': [40.7506, -73.9972],
  '10002': [40.717, -73.989],
  '10017': [40.7522, -73.9725],
  '10018': [40.7557, -73.9925],
  '11201': [40.6955, -73.989],
  '11205': [40.6976, -73.9713],
  '11215': [40.6673, -73.985],
}

const CAT_EMOJI: Record<string, string> = {
  Electrical: '⚡',
  HVAC: '❄️',
  Roofing: '🏠',
  Plumbing: '🚿',
  Carpentry: '🪚',
  General: '🧰',
  Landscaping: '🌿',
}

export default function ProMapInner({
  category,
  centerZip,
  radiusMiles = 10,
  searchCenter,
  onSearchHere,
}: Props) {
  const { state, addToast } = useApp()

  const contractors = Array.isArray((state as any)?.contractors) ? (state as any).contractors : []
  const pros = useMemo(() => {
    return contractors.filter((c: any) =>
      !category || (Array.isArray(c?.services) && c.services.includes(category))
    )
  }, [contractors, category])

  const mapRef = useRef<HTMLDivElement>(null)
  const mapObjRef = useRef<any>(null)
  const layerRef = useRef<any>(null)
  const legendRef = useRef<any>(null)
  const actionsRef = useRef<any>(null)
  const expandedMarkerRef = useRef<any | null>(null)
  const manualCenterRef = useRef<[number, number] | null>(null)
const suppressFitRef = useRef(false)


  /* ---------- Controls ---------- */
  function addOrReplaceLegend(L: any, map: any) {
    if (legendRef.current) {
      try { map.removeControl(legendRef.current) } catch {}
      legendRef.current = null
    }
    const Legend = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: () => {
        const wrap = L.DomUtil.create('div', 'al-legend-wrap')
        wrap.style.cssText = 'display:inline-block; pointer-events:auto;'

        const pill = L.DomUtil.create('div', 'al-legend', wrap)
        pill.style.cssText = `
          background:rgba(255,255,255,.92); backdrop-filter:blur(4px);
          border:1px solid rgba(15,23,42,.08);
          border-radius:12px; box-shadow:0 1px 3px rgba(2,6,23,.08);
          padding:6px 10px; color:#0f172a;
          display:flex; gap:14px; align-items:flex-end; white-space:nowrap;
        `

        Object.entries(CAT_EMOJI).forEach(([label, emoji]) => {
          const item = L.DomUtil.create('div', '', pill)
          item.style.cssText = `
            display:inline-flex; flex-direction:column; align-items:center; gap:3px;
          `
          const bubble = L.DomUtil.create('div', '', item)
          bubble.style.cssText = `
            width:18px; height:18px; display:flex; align-items:center; justify-content:center;
            border-radius:9999px; background:#ecfdf5; border:1px solid rgba(16,185,129,.5);
          `
          const img = L.DomUtil.create('img', '', bubble) as HTMLImageElement
          img.src = twemojiUrl(emoji)
          img.alt = label
          img.style.cssText = 'width:11px; height:11px; display:block;'

          const cap = L.DomUtil.create('div', '', item)
          cap.textContent = label
          cap.style.cssText = 'font-size:10px; line-height:1.1; color:#334155; text-align:center;'
        })

        L.DomEvent.disableClickPropagation(wrap)
        return wrap
      }
    })
    legendRef.current = new Legend()
    legendRef.current.addTo(map)
  }

  function addOrReplaceActions(L: any, map: any) {
    if (actionsRef.current) {
      try { map.removeControl(actionsRef.current) } catch {}
      actionsRef.current = null
    }
    const Actions = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: () => {
        // transparent container, placed below legend
        const box = L.DomUtil.create('div', 'al-actions')
        box.style.cssText = `
          margin-top:6px; background:transparent; pointer-events:auto;
          display:flex; gap:8px; align-items:center; white-space:nowrap;
        `
  
        const locateBtn = L.DomUtil.create('button', '', box) as HTMLButtonElement
        locateBtn.innerHTML = '📍&nbsp;Locate me'
        locateBtn.style.cssText = tinyBtn(false) + 'display:inline-flex; align-items:center; justify-content:center;'
  
        const searchBtn = L.DomUtil.create('button', '', box) as HTMLButtonElement
        searchBtn.innerHTML = '🔎&nbsp;Search this area'
        // make it white too (no green)
        searchBtn.style.cssText = tinyBtn(false) + 'display:inline-flex; align-items:center; justify-content:center;'
  
        // smooth hover/press growth
        const addHoverGrow = (el: HTMLElement) => {
          el.style.transformOrigin = 'center center'
          el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.06)' })
          el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
          el.addEventListener('mousedown',  () => { el.style.transform = 'scale(0.98)' })
          el.addEventListener('mouseup',    () => { el.style.transform = 'scale(1.06)' })
          el.addEventListener('blur',       () => { el.style.transform = 'scale(1)' })
        }
        addHoverGrow(locateBtn)
        addHoverGrow(searchBtn)
  
        L.DomEvent.disableClickPropagation(box)
  
        locateBtn.onclick = () => {
          if (!navigator.geolocation) { addToast('Geolocation not supported', 'error'); return }
          navigator.geolocation.getCurrentPosition(
            pos => {
              const { latitude, longitude } = pos.coords
              manualCenterRef.current = [latitude, longitude]
              suppressFitRef.current = true
              map.panTo(manualCenterRef.current, { animate: true })
              onSearchHere?.(manualCenterRef.current)
            },
            () => addToast('Unable to retrieve your location', 'error'),
            { enableHighAccuracy: true, timeout: 8000 }
          )
        }
  
        searchBtn.onclick = () => {
          const c = map.getCenter()
          manualCenterRef.current = [c.lat, c.lng]
          suppressFitRef.current = true
          onSearchHere?.(manualCenterRef.current)
        }
  
        return box
      }
    })
    actionsRef.current = new Actions()
    actionsRef.current.addTo(map)
  }
  

  /* ---------- Init / effects ---------- */
  useEffect(() => {
    ;(async () => {
      if (!mapRef.current) return
      try {
        const L = await import('leaflet')

        if (!mapObjRef.current) {
          const initialCenter: [number, number] =
            searchCenter ??
            (centerZip && ZIP_COORDS[centerZip]) ??
            [40.7128, -74.006]

          const map = L.map(mapRef.current, { zoomControl: false }).setView(initialCenter, 11)
          mapObjRef.current = map

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap',
          }).addTo(map)

          L.control.zoom({ position: 'topright' }).addTo(map)
          map.on('click', () => collapseExpanded(L, expandedMarkerRef))
        }

        addOrReplaceLegend(L, mapObjRef.current)
        addOrReplaceActions(L, mapObjRef.current)

        refreshMarkers(
          L,
          mapObjRef.current,
          pros,
          layerRef,
          expandedMarkerRef,
          category,
          { fit: !suppressFitRef.current }
        )
        suppressFitRef.current = false
        
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('Leaflet init failed:', e)
      }
    })()

    return () => {
      try {
        if (mapObjRef.current) {
          try { if (legendRef.current) mapObjRef.current.removeControl(legendRef.current) } catch {}
          try { if (actionsRef.current) mapObjRef.current.removeControl(actionsRef.current) } catch {}
          try { if (layerRef.current) mapObjRef.current.removeLayer(layerRef.current) } catch {}
          mapObjRef.current.remove()
        }
      } catch {}
      mapObjRef.current = null
      layerRef.current = null
      legendRef.current = null
      actionsRef.current = null
      expandedMarkerRef.current = null
      manualCenterRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount once

  // Recenter only to searchCenter, else to manual sticky, else to zip
  useEffect(() => {
    ;(async () => {
      const map = mapObjRef.current
      if (!map) return
      try {
        const L = await import('leaflet')
        const nextCenter: [number, number] | null =
          searchCenter ??
          manualCenterRef.current ??
          (centerZip && ZIP_COORDS[centerZip]) ??
          null

        if (nextCenter) {
          map.setView(nextCenter, map.getZoom() || 11, { animate: true })
        }
        refreshMarkers(
          L,
          map,
          pros,
          layerRef,
          expandedMarkerRef,
          category,
          { fit: !suppressFitRef.current }
        )
        suppressFitRef.current = false
        
      } catch {}
    })()
  }, [pros, searchCenter, centerZip, category])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[360px] w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      <div className="absolute left-3 bottom-3 px-2.5 py-1.5 rounded-xl bg-white/90 text-xs border border-slate-200 shadow-soft">
        Radius: {radiusMiles} mi
      </div>
    </div>
  )
}

/* ---------- Markers ---------- */

function refreshMarkers(
  L: any,
  map: any,
  items: any[],
  layerRef: React.MutableRefObject<any>,
  expandedRef: React.MutableRefObject<any>,
  selectedCategory?: string,
  opts?: { fit?: boolean }
) {
  const shouldFit = opts?.fit ?? true

  try {
    if (layerRef.current) {
      layerRef.current.clearLayers?.()
      map.removeLayer?.(layerRef.current)
      layerRef.current = null
    }
  } catch {}

  const group = L.layerGroup()

  items.forEach((c: any) => {
    const lat = Number(c?.loc?.lat)
    const lng = Number(c?.loc?.lng)
    if (!isFinite(lat) || !isFinite(lng)) return

    const svcs: string[] = Array.isArray(c?.services) ? c.services : []
    const svc = selectedCategory && svcs.includes(selectedCategory) ? selectedCategory : svcs[0]
    const emoji = CAT_EMOJI[svc as keyof typeof CAT_EMOJI] ?? '🔧'

    const m = createPinMarker(L, map, [lat, lng], { emoji, data: c, expanded: false })
    m.addTo(group)

    m.on('mouseover', () => setBubbleScale(m, 1.12))
    m.on('mouseout',  () => setBubbleScale(m, m._al.expanded ? 1.12 : 1))

    m.on('click', () => {
      if (expandedRef.current && expandedRef.current !== m) collapseMarker(L, expandedRef.current)
      if (m._al.expanded) {
        collapseMarker(L, m); expandedRef.current = null
      } else {
        expandMarker(L, map, m); expandedRef.current = m
      }
    })
  })

  group.addTo(map)
  layerRef.current = group

  if (shouldFit) {
    const pts = group.getLayers().map((l: any) => l.getLatLng && l.getLatLng()).filter(Boolean)
    if (pts.length > 1) {
      const b = L.latLngBounds(pts)
      map.fitBounds(b, { padding: [24, 24], maxZoom: 13 })
    } else if (pts.length === 1) {
      map.setView(pts[0], 12, { animate: false })
    }
  }
}


/* ---------- Icon + helpers ---------- */

function createPinMarker(
  L: any,
  map: any,
  latlng: [number, number],
  payload: { emoji: string; data: any; expanded: boolean }
) {
  const icon = makePinIcon(L, payload)
  const m = L.marker(latlng, { icon, riseOnHover: true }) as any
  m._al = { ...payload }
  m._map = map
  return m
}

function expandMarker(L: any, map: any, m: any) {
  m._al.expanded = true
  m.setZIndexOffset(1000)
  m.setIcon(makePinIcon(L, m._al))
  setBubbleScale(m, 1.12)
  centerMarkerWithOffset(L, map, m, 110)
}

function collapseMarker(L: any, m: any) {
  m._al.expanded = false
  m.setZIndexOffset(0)
  m.setIcon(makePinIcon(L, m._al))
  setBubbleScale(m, 1)
}

function setBubbleScale(m: any, scale: number) {
  const el = m.getElement() as HTMLElement | null
  const bubble = el?.querySelector('.al-pin-bubble') as HTMLElement | null
  if (bubble) bubble.style.transform = `translateX(-50%) scale(${scale})`
}

function centerMarkerWithOffset(L: any, map: any, m: any, offsetY = 110, offsetX = 0) {
  const ll = m.getLatLng()
  const z = map.getZoom()
  const pinWorld = map.project(ll, z)
  const offset = L.point(offsetX, -offsetY)
  const targetCenterWorld = pinWorld.subtract(offset)
  const targetCenterLatLng = map.unproject(targetCenterWorld, z)
  map.panTo(targetCenterLatLng, { animate: true })
}

/* ---------- Twemoji pin ---------- */

function makePinIcon(L: any, opts: { emoji: string; data: any; expanded: boolean }) {
  const { emoji, data, expanded } = opts
  const bubble = 26
  const tipH = 8
  const tipW = 12
  const border = '#10b981'
  const fill = '#d1fae5'

  const tw = twemojiUrl(emoji)
  const imgSize = Math.floor(bubble * 0.7)

  const bubbleStyleBase = [
    'position:absolute','left:50%','top:0','transform:translateX(-50%)',
    `width:${bubble}px`,`height:${bubble}px`,
    `background:${fill}`,`border:1.5px solid ${border}`,'border-radius:9999px',
    'box-shadow:0 2px 4px rgba(0,0,0,.18)',
    'transition:transform .12s ease','transform-origin:bottom center','z-index:20'
  ].join(';') + ';'
  const bubbleStyle = bubbleStyleBase + (expanded ? 'transform:translateX(-50%) scale(1.12);' : 'transform:translateX(-50%) scale(1);')

  const iconHeight = bubble + tipH + (expanded ? 76 : 2)

  const ratingVal = Number(data?.rating) || 0
  const ratingText = ratingVal > 0 ? `★ ${ratingVal.toFixed(1)} / 5` : 'No rating yet'
  const name = escapeHtml(String(data?.name ?? 'Contractor'))
  const city = escapeHtml(String(data?.city ?? ''))
  const id = encodeURIComponent(String(data?.id ?? ''))
  const viewHref = `/pro/${id}`
  const messageHref = `/messages?to=${id}`

  const cardHtml = expanded ? `
    <div class="al-pin-card" style="
      position:absolute; left:50%; top:${bubble + tipH + 6}px; transform:translateX(-50%);
      min-width:180px; max-width:240px;
      background:#ffffff; border:1px solid rgba(15,23,42,.12);
      border-radius:12px; box-shadow:0 8px 22px rgba(2,6,23,.22);
      padding:8px; z-index:9999; color:#0f172a; font-size:12px;
      font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;
    ">
      <div style="font-weight:700; font-size:13px;">${name}</div>
      <div style="color:#475569; margin-top:2px;">${city ? city + ' • ' : ''}${ratingText}</div>
      <div style="display:flex; gap:6px; margin-top:8px;">
        <a href="${viewHref}" style="
          display:inline-flex; align-items:center; justify-content:center;
          padding:6px 10px; border-radius:10px;
          background:#10b981; color:#fff; text-decoration:none; font-weight:700;
        ">View</a>
        <a href="${messageHref}" style="
          display:inline-flex; align-items:center; justify-content:center;
          padding:6px 10px; border-radius:10px;
          border:1px solid rgba(15,23,42,.15); background:#fff; color:#0f172a; text-decoration:none; font-weight:700;
        ">Message</a>
      </div>
    </div>
  ` : ''

  const html = `
    <div class="al-pin-wrap" style="position:relative; width:${bubble}px; height:${iconHeight}px; pointer-events:auto; z-index:${expanded ? 1000 : 10};">
      <div class="al-pin-bubble" style="${bubbleStyle}">
        <div style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:${bubble}px; height:${bubble}px; pointer-events:none; display:flex; align-items:center; justify-content:center;">
          <img src="${tw}" alt="" style="width:${imgSize}px; height:${imgSize}px; display:block; image-rendering:auto;"/>
        </div>
      </div>
      <div class="al-pin-tip-border" style="
        position:absolute; left:50%; top:${bubble - 1}px; transform:translateX(-50%);
        width:0; height:0;
        border-left:${tipW/2 + 1}px solid transparent;
        border-right:${tipW/2 + 1}px solid transparent;
        border-top:${tipH + 2}px solid ${border};
        filter:drop-shadow(0 1px 1px rgba(0,0,0,.15));
        z-index:16;
      "></div>
      <div class="al-pin-tip-fill" style="
        position:absolute; left:50%; top:${bubble}px; transform:translateX(-50%);
        width:0; height:0;
        border-left:${tipW/2}px solid transparent;
        border-right:${tipW/2}px solid transparent;
        border-top:${tipH}px solid ${fill};
        z-index:17;
      "></div>
      ${cardHtml}
    </div>
  `
  return L.divIcon({
    className: 'al-emoji-pin',
    html,
    iconSize: [bubble, iconHeight],
    iconAnchor: [Math.floor(bubble / 2), bubble + tipH + 2],
    popupAnchor: [0, -(bubble / 2)],
  })
}

/* ---------- Tiny UI helpers ---------- */

function tinyBtn(primary = false) {
  return `
    cursor:pointer; padding:6px 10px; border-radius:10px;
    font-size:11px; font-weight:700; line-height:1;
    ${primary
      ? 'background:#10b981; color:#fff; border:1px solid #10b981;'
      : 'background:rgba(255,255,255,.95); color:#0f172a; border:1px solid rgba(15,23,42,.12);'}
    box-shadow:0 1px 3px rgba(2,6,23,.08);
    transition:filter .12s ease, transform .06s ease;
  `
}

/* ---------- utils ---------- */

function twemojiUrl(emoji: string) {
  const override: Record<string, string> = { '❄️': '2744' }
  const code = override[emoji] ?? toCodePoints(emoji).join('-')
  return `https://twemoji.maxcdn.com/v/latest/svg/${code}.svg`
}
function toCodePoints(str: string) {
  const cps: string[] = []
  for (const ch of Array.from(str)) cps.push(ch.codePointAt(0)!.toString(16))
  return cps
}
function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, m =>
    m === '&' ? '&amp;' :
    m === '<' ? '&lt;'  :
    m === '>' ? '&gt;'  :
    m === '"' ? '&quot;': '&#39;'
  )
}
function collapseExpanded(L: any, expandedRef: React.MutableRefObject<any>) {
  if (expandedRef.current) {
    collapseMarker(L, expandedRef.current)
    expandedRef.current = null
  }
}
