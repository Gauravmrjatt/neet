'use client'

import React, { useState, useMemo } from 'react'
import { Media } from '@/payload-types'

interface CounselorData {
  id: string
  name: string
  slug: string
  designation: string
  image?: (string | null) | Media
  specializations?: { specialization?: string | null }[] | null
  experience?: number | null
}

interface CounselorFilterProps {
  counselors: CounselorData[]
}

const SPECIALIZATION_OPTIONS = [
  { label: 'All', value: undefined },
  { label: 'NEET', value: 'neet' },
  { label: 'JOSAA', value: 'josaa' },
  { label: 'JEE', value: 'jee' },
  { label: 'General', value: 'general' },
]

export function CounselorFilter({ counselors }: CounselorFilterProps) {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  const filtered = useMemo(() => {
    if (!selected) return counselors
    return counselors.filter((c) =>
      c.specializations?.some((s) => s.specialization === selected)
    )
  }, [counselors, selected])

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {SPECIALIZATION_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setSelected(opt.value)}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition ${
              opt.value === selected
                ? 'bg-[#062963] text-white'
                : 'border border-gray-300 bg-white text-[#062963] hover:bg-[#062963] hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((counselor) => {
            const imageUrl = typeof counselor.image === 'object' ? counselor.image?.url : null
            return (
              <div
                key={counselor.id}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg hover:-translate-y-0.5"
              >
                {imageUrl ? (
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-[#062963]/20">
                    <img
                      src={imageUrl}
                      alt={counselor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#062963] text-2xl font-bold text-white">
                    {counselor.name.charAt(0)}
                  </div>
                )}
                <h3 className="mt-4 text-lg font-bold text-[#062963]">{counselor.name}</h3>
                <p className="text-sm text-gray-600">{counselor.designation}</p>
                {counselor.experience && (
                  <p className="mt-1 text-xs text-[#062963]/70 font-medium">
                    {counselor.experience} years experience
                  </p>
                )}
                {counselor.specializations && counselor.specializations.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {counselor.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-[#062963]/10 text-[#062963] px-2.5 py-0.5 text-xs font-medium capitalize"
                      >
                        {s.specialization}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No counsellors found for this specialization.</p>
      )}
    </div>
  )
}
