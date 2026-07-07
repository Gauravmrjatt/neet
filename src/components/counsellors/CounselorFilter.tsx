'use client'

import React, { useState, useMemo } from 'react'
import { Media, Specialization } from '@/payload-types'

interface CounselorData {
  id: string
  name: string
  slug: string
  designation: string
  image?: (string | null) | Media
  email?: string | null
  phone?: string | null
  specializations?: { specialization?: { slug?: string | null; name?: string | null } | string | null; id?: string | null }[] | null
  experience?: number | null
}

interface CounselorFilterProps {
  counselors: CounselorData[]
  specializations: Specialization[]
}

export function CounselorFilter({ counselors, specializations }: CounselorFilterProps) {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  const specializationOptions = useMemo(() => {
    const options: { label: string; value: string | undefined }[] = [
      { label: 'All', value: undefined },
      ...specializations.map((s) => ({ label: s.name, value: s.slug })),
    ]
    return options
  }, [specializations])

  const filtered = useMemo(() => {
    if (!selected) return counselors
    return counselors.filter((c) =>
      c.specializations?.some((s) => {
        const spec = s.specialization
        if (typeof spec === 'object' && spec !== null) return spec.slug === selected
        return spec === selected
      })
    )
  }, [counselors, selected])

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {specializationOptions.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => setSelected(opt.value)}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition ${
              opt.value === selected
                ? 'bg-primary-navy text-white'
                : 'border border-border bg-card text-primary-navy hover:bg-primary-navy hover:text-white'
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
                className="rounded-xl border border-border bg-card p-6 text-center transition hover:shadow-lg hover:-translate-y-0.5"
              >
                {imageUrl ? (
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-primary-navy/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={counselor.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-navy text-2xl font-bold text-white">
                    {counselor.name.charAt(0)}
                  </div>
                )}
                <h3 className="mt-4 text-lg font-bold text-primary-navy">{counselor.name}</h3>
                <p className="text-sm text-muted-foreground">{counselor.designation}</p>
                {counselor.experience && (
                  <p className="mt-1 text-xs text-primary-navy/70 font-medium">
                    {counselor.experience} years experience
                  </p>
                )}
                {counselor.email && (
                  <p className="mt-1 text-xs text-muted-foreground">{counselor.email}</p>
                )}
                {counselor.phone && (
                  <p className="text-xs text-muted-foreground">{counselor.phone}</p>
                )}
                {counselor.specializations && counselor.specializations.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {counselor.specializations.map((s, i) => (
                      <span
                        key={s.id || i}
                        className="rounded-full bg-primary-navy/10 text-primary-navy px-2.5 py-0.5 text-xs font-medium capitalize"
                      >
                        {typeof s.specialization === 'object' && s.specialization !== null
                          ? s.specialization.name
                          : s.specialization}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">No counsellors found for this specialization.</p>
      )}
    </div>
  )
}
