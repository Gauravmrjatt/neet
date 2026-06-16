'use client'

import { ChevronDown, LogOut, Menu, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface MobileMenuItem {
  label: string
  link: string
  showWhen?: string | null
  children?: Array<{ label: string; link: string }> | null
}

interface MobileMenuProps {
  user?: { email?: string | null } | null
  navigation: MobileMenuItem[]
  ctaButton?: {
    text?: string | null
    link?: string | null
  } | null
  siteName?: string
}

function shouldShow(showWhen: string | null | undefined, user: any): boolean {
  const value = showWhen || 'always'
  if (value === 'always') return true
  if (value === 'authenticated') return !!user
  if (value === 'unauthenticated') return !user
  return true
}

export function MobileMenu({ user, navigation, ctaButton, siteName = 'NEET Counselling' }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [expandedLabels, setExpandedLabels] = useState<Set<string>>(new Set())
  const router = useRouter()
  const pathname = usePathname()

  const visibleItems = navigation.filter((item) => shouldShow(item.showWhen, user))

  const toggleExpand = useCallback((label: string) => {
    setExpandedLabels((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setOpen(false)
      router.push('/')
      router.refresh()
    } catch {
      // ignore
    }
  }, [router])

  const closeMenu = useCallback(() => setOpen(false), [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-primary hover:bg-navbar-hover"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[320px] flex-col gap-0 border-l-border/70 bg-background/95 p-0 backdrop-blur-md sm:w-[360px]"
      >
        <SheetHeader className="border-b border-border/70 bg-navbar-bg/70 px-5 py-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-button-gold" aria-hidden="true" />
            </span>
            <SheetTitle className="font-display text-base font-bold tracking-tight text-primary">
              {siteName}
            </SheetTitle>
          </div>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {visibleItems.map((item) => {
              const isActive =
                item.link === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.link)
              const hasChildren = item.children && item.children.length > 0
              const isExpanded = expandedLabels.has(item.label)

              if (item.link === '/logout') {
                return (
                  <li key="logout">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left',
                        'text-sm font-semibold text-foreground',
                        'transition-all duration-200 ease-out',
                        'hover:bg-navbar-hover hover:text-primary',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      )}
                    >
                      <LogOut className="h-4 w-4 text-primary/70" aria-hidden="true" />
                      {item.label}
                    </button>
                  </li>
                )
              }

              if (hasChildren) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl px-3 py-2.5',
                        'text-sm font-semibold transition-all duration-200 ease-out',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive
                          ? 'bg-button-gold text-primary shadow-sm'
                          : 'text-foreground hover:bg-navbar-hover hover:text-primary',
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isExpanded && 'rotate-180',
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <ul className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                        {item.children!.map((child) => {
                          const isChildActive =
                            child.link === '/'
                              ? pathname === '/'
                              : pathname.startsWith(child.link)
                          return (
                            <li key={child.link}>
                              <Link
                                href={child.link}
                                onClick={closeMenu}
                                aria-current={isChildActive ? 'page' : undefined}
                                className={cn(
                                  'flex items-center rounded-xl px-3 py-2',
                                  'text-sm font-medium transition-all duration-200 ease-out',
                                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                  isChildActive
                                    ? 'bg-button-gold/10 text-primary'
                                    : 'text-muted-foreground hover:bg-navbar-hover hover:text-primary',
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              }

              return (
                <li key={item.link}>
                  <Link
                    href={item.link}
                    onClick={closeMenu}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between rounded-2xl px-3 py-2.5',
                      'text-sm font-semibold transition-all duration-200 ease-out',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive
                        ? 'bg-button-gold text-primary shadow-sm'
                        : 'text-foreground hover:bg-navbar-hover hover:text-primary',
                    )}
                  >
                    <span>{item.label}</span>
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-border/70 bg-navbar-bg/50 px-5 py-4">
          {user ? (
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground">
                Signed in as
              </p>
              <p className="truncate text-sm font-semibold text-primary">
                {user.email}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild className="w-full rounded-full">
                <Link href="/login" onClick={closeMenu}>
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                className="w-full rounded-full bg-button-gold font-bold text-primary shadow-sm hover:bg-button-gold-hover"
              >
                <Link href={ctaButton?.link || '/signup'} onClick={closeMenu}>
                  {ctaButton?.text || 'Sign up'}
                </Link>
              </Button>
              <Separator className="my-1 bg-border/60" />
              <p className="text-center text-[11px] text-muted-foreground">
                Get expert NEET &amp; JOSAA guidance.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
