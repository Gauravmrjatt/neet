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
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants'

interface MobileMenuProps {
  user?: { email?: string | null } | null
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          {user ? (
            <>
              <p className="px-3 text-sm text-muted-foreground">{user.email}</p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/my-plan" onClick={() => setOpen(false)}>
                  My Plan
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/admin" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
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
