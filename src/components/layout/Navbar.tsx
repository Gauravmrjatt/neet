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
    <nav className="bg-[#F6F3EE] text-[#062963] h-[45px] font-medium whitespace-nowrap border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex h-full overflow-x-auto">
        {visibleItems.map((item: any) => {
          if (item.link === '/logout') {
            return <LogoutButton key="logout" label={item.label} />
          }
          return <NavLink key={item.link} href={item.link} label={item.label} />
        })}
        {!user && ctaButton?.text && ctaButton?.link && (
          <NavLink href={ctaButton.link} label={ctaButton.text} />
        )}
      </div>
    </nav>
  )
}
