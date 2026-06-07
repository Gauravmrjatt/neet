'use client'

import { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  label: string
  /** Visual variant: default regular nav link, or gold CTA pill. */
  variant?: 'default' | 'cta'
}

export const NavLink = memo(function NavLink({ href, label, variant = 'default' }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  if (variant === 'cta') {
    return (
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5',
          'bg-button-gold text-primary shadow-sm',
          'text-sm font-bold tracking-wide',
          'transition-all duration-200 ease-out',
          'hover:bg-button-gold-hover hover:shadow-md hover:-translate-y-px',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-navbar-bg',
        )}
      >
        {label}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative inline-flex items-center rounded-full px-3.5 py-1.5',
        'text-xs font-semibold tracking-wide sm:text-sm',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-navbar-bg',
        isActive
          ? 'bg-button-gold text-primary shadow-sm'
          : 'text-primary/85 hover:bg-navbar-hover hover:text-primary',
      )}
    >
      {label}
    </Link>
  )
})
