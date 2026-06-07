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
      className="call-button inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold mt-1.5 transition-transform hover:scale-105"
      aria-label={`Call us at ${phone}`}
    >
      <Phone className="call-button-icon w-3 h-3" />
      <span>Call: {phone}</span>
    </a>
  )
}
