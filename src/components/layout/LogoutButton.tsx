'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5',
        'text-xs font-semibold tracking-wide text-primary/85 sm:text-sm',
        'transition-all duration-200 ease-out',
        'hover:bg-navbar-hover hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-navbar-bg',
        'disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      {loading ? 'Logging out...' : label}
    </button>
  )
}
