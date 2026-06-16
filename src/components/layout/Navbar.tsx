import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getHeader } from '@/lib/queries/globals'
import { NavLink } from './NavLink'
import { LogoutButton } from './LogoutButton'
import { NavDropdown } from './NavDropdown'

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
      className="max-w-6xl mx-auto sticky top-[88px] z-30 w-full border-b border-border text-primary bg-background  lg:top-[9px]"
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-1">
        {visibleItems.map((item: any) => {
          if (item.link === '/logout') {
            return <LogoutButton key="logout" label={item.label} />
          }
          if (item.children && item.children.length > 0) {
            return <NavDropdown key={item.label} label={item.label} children={item.children} />
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
