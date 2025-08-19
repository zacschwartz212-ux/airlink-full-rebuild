'use client'
import React, { useRef } from 'react'

export default function UploadInput({ onChange }:{ onChange: (files:File[])=>void }){
  const ref = useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<File[]>([])

  const addFiles = (list: FileList | null)=>{
    if(!list) return
    const incoming = Array.from(list).slice(0, Math.max(0, 5 - files.length))
    const next = [...files, ...incoming]
    setFiles(next)
    onChange(next)
  }

  const removeAt = (i:number)=>{
    const next = files.filter((_,idx)=>idx!==i)
    setFiles(next)
    onChange(next)
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={e=>addFiles(e.target.files)}
      />
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-outline" onClick={()=>ref.current?.click()}>Add images</button>
        {files.map((f,i)=>(
          <div key={i} className="relative">
            {/* preview */}
            <img
              src={URL.createObjectURL(f)}
              alt={f.name}
              className="h-20 w-20 object-cover rounded-lg border border-slate-200"
              onLoad={e=>URL.revokeObjectURL((e.target as HTMLImageElement).src)}
            />
            <button
              type="button"
              onClick={()=>removeAt(i)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black/70 text-white text-xs"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
