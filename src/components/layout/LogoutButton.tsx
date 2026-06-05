'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LogoutButtonProps {
  label?: string
}

export function LogoutButton({ label = 'Logout' }: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/')
      router.refresh()
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center px-3 py-2 hover:bg-[#e8e4de] text-xs sm:text-sm transition-colors text-[#062963] cursor-pointer disabled:opacity-50"
    >
      {loading ? 'Logging out...' : label}
    </button>
  )
}
