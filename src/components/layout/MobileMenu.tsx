'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { SITE_NAME } from '@/lib/constants'

interface MobileMenuProps {
  user?: { email?: string | null } | null
  navigation: Array<{
    label: string
    link: string
    showWhen?: string | null
  }>
  ctaButton?: {
    text?: string | null
    link?: string | null
  } | null
}

function shouldShow(showWhen: string | null | undefined, user: any): boolean {
  const value = showWhen || 'always'
  if (value === 'always') return true
  if (value === 'authenticated') return !!user
  if (value === 'unauthenticated') return !user
  return true
}

export function MobileMenu({ user, navigation, ctaButton }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const visibleItems = navigation.filter((item) => shouldShow(item.showWhen, user))

  async function handleLogout() {
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
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">{SITE_NAME}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          {visibleItems.map((item) => {
            if (item.link === '/logout') {
              return (
                <button
                  key="logout"
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  {item.label}
                </button>
              )
            }
            return (
              <Link
                key={item.link}
                href={item.link}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          {user ? (
            <p className="px-3 text-sm text-muted-foreground">{user.email}</p>
          ) : (
            <>
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                className="w-full bg-[#FBAC1A] hover:bg-[#e09b18] text-[#062963] font-semibold"
              >
                <Link href="/signup" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
