'use client'

import { useState, useEffect } from 'react'
import { NavLink } from './NavLink'
import { LogoutButton } from './LogoutButton'
import { NavDropdown } from './NavDropdown'

type NavItem = {
  label: string
  link?: string | null
  showWhen?: string | null
  children?: { label: string; link: string; id?: string | null }[] | null
}

type NavbarClientProps = {
  navItems: NavItem[]
  ctaButton?: { text?: string | null; link?: string | null } | null
}

function shouldShow(showWhen: string | null | undefined, isLoggedIn: boolean): boolean {
  const value = showWhen || 'always'
  if (value === 'always') return true
  if (value === 'authenticated') return isLoggedIn
  if (value === 'unauthenticated') return !isLoggedIn
  return true
}

export function NavbarClient({ navItems, ctaButton }: NavbarClientProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me?depth=0')
        const data = await res.json()
        setIsLoggedIn(!!data?.user)
      } catch {
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    const alwaysVisible = navItems.filter((item) => shouldShow(item.showWhen, false))
    return (
      <nav aria-label="Primary" className="max-w-6xl mx-auto overflow-x-auto scrollbar-hide sticky top-[88px] z-30 w-full border-b border-border text-primary bg-background lg:top-[9px]">
        <div className="mx-auto flex h-12 max-w-6xl items-center gap-1">
          {alwaysVisible.map((item) => {
            if (item.children && item.children.length > 0) {
              return <NavDropdown key={item.label} label={item.label} children={item.children} />
            }
            return <NavLink key={item.link || item.label} href={item.link || '/'} label={item.label} />
          })}
        </div>
      </nav>
    )
  }

  const visibleItems = navItems.filter((item) => shouldShow(item.showWhen, isLoggedIn))

  return (
    <nav
      aria-label="Primary"
      className="max-w-6xl mx-auto overflow-x-auto scrollbar-hide sticky lg:rounded-full top-[0px] z-30 w-full border-b border-border text-primary bg-background lg:top-[10px] px-4"
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-1">
        {visibleItems.map((item) => {
          if (item.link === '/logout') {
            return <LogoutButton key="logout" label={item.label} />
          }
          if (item.children && item.children.length > 0) {
            return <NavDropdown key={item.label} label={item.label} children={item.children} />
          }
          return <NavLink key={item.link || item.label} href={item.link || '/'} label={item.label} />
        })}
        {!isLoggedIn && ctaButton?.text && ctaButton?.link && (
          <div className="ml-auto pl-2">
            <NavLink href={ctaButton.link} label={ctaButton.text} variant="cta" />
          </div>
        )}
      </div>
    </nav>
  )
}
