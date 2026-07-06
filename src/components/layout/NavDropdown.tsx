'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const dropdownWidth = 200
      const left = Math.min(rect.left, window.innerWidth - dropdownWidth - 8)
      setPosition({ top: rect.bottom + 4, left })
    }
  }, [])

  useEffect(() => {
    if (open) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, { passive: true })
      window.addEventListener('resize', updatePosition)
    }
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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
    <div className="inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className={cn(
          'relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-1.5',
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

      {open && (
        <div
          ref={dropdownRef}
          style={{ position: 'fixed', top: position.top, left: position.left }}
          className="z-50 min-w-[200px] rounded-xl border border-border bg-popover p-1.5 shadow-lg"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
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
      )}
    </div>
  )
}
