'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavDropdownProps {
  label: string
  children: Array<{ label: string; link: string; id?: string | null }>
}

export function NavDropdown({ label, children }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = children.some(
    (child) =>
      child.link === '/' ? pathname === '/' : pathname.startsWith(child.link),
  )

  return (
    <div
      ref={ref}
      className="relative group"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className={cn(
          'group relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-1.5',
          'text-xs font-semibold tracking-wide sm:text-sm',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-navbar-bg',
          isActive
            ? 'bg-button-gold text-primary shadow-sm'
            : 'text-primary/85 hover:bg-navbar-hover hover:text-primary',
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'absolute left-0 top-full z-50 min-w-[200px]',
          'rounded-xl border border-border bg-popover p-1.5 shadow-lg',
          'invisible opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100',
          open && 'visible opacity-100',
        )}
        onMouseEnter={() => setOpen(true)}
      >
        {children.map((child) => {
          const isChildActive =
            child.link === '/'
              ? pathname === '/'
              : pathname.startsWith(child.link)
          return (
            <Link
              key={child.link}
              href={child.link}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isChildActive
                  ? 'bg-button-gold/10 text-primary'
                  : 'text-foreground hover:bg-navbar-hover hover:text-primary',
              )}
            >
              {child.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
