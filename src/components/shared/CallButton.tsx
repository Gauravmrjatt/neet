'use client'

import { Phone } from 'lucide-react'

interface CallButtonProps {
  phone: string
}

export function CallButton({ phone }: CallButtonProps) {
  const cleanPhone = phone.replace(/[^0-9+]/g, '')

  return (
    <a
      href={`tel:${cleanPhone}`}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold mt-1.5 transition-transform hover:scale-105"
      style={{
        background: 'linear-gradient(135deg, #16a34a, #15803d)',
        boxShadow: '0 0 0 0 rgba(22, 163, 74, 0.7), 0 2px 8px rgba(22, 163, 74, 0.35)',
        animation: 'callPulse 2s ease-in-out infinite',
      }}
      aria-label={`Call us at ${phone}`}
    >
      <Phone className="w-3 h-3" style={{ animation: 'callWiggle 2s ease-in-out infinite' }} />
      <span>Call: {phone}</span>
    </a>
  )
}
