import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getHeader } from '@/lib/queries/globals'
import { NavLink } from './NavLink'
import { LogoutButton } from './LogoutButton'

function shouldShow(showWhen: string | null | undefined, user: any): boolean {
  const value = showWhen || 'always'
  if (value === 'always') return true
  if (value === 'authenticated') return !!user
  if (value === 'unauthenticated') return !user
  return true
}

export async function Navbar() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const headerData = await getHeader()
  const navItems = headerData.navigation || []
  const ctaButton = headerData.ctaButton

  const visibleItems = navItems.filter((item: any) => shouldShow(item.showWhen, user))

  return (
    <nav
      aria-label="Primary"
      className="sticky top-[88px] z-30 hidden w-full border-b border-border/70 bg-navbar-bg/95 text-primary shadow-sm backdrop-blur-md md:block lg:top-[96px]"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {visibleItems.map((item: any) => {
          if (item.link === '/logout') {
            return <LogoutButton key="logout" label={item.label} />
          }
          return <NavLink key={item.link} href={item.link} label={item.label} />
        })}
        {!user && ctaButton?.text && ctaButton?.link && (
          <div className="ml-auto pl-2">
            <NavLink
              href={ctaButton.link}
              label={ctaButton.text}
              variant="cta"
            />
          </div>
        )}
      </div>
    </nav>
  )
}
