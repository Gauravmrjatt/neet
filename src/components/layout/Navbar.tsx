import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NAV_ITEMS } from '@/lib/constants'
import { NavLink } from './NavLink'
import { LogoutButton } from './LogoutButton'

export async function Navbar() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <nav className="bg-[#F6F3EE] text-[#062963] h-[45px] font-medium whitespace-nowrap border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex h-full overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
        {user ? (
          <>
            <NavLink href="/my-plan" label="My Plan" />
            <NavLink href="/admin" label="Dashboard" />
            <LogoutButton />
          </>
        ) : (
          <>
            <NavLink href="/login" label="Login" />
            <NavLink href="/signup" label="Sign Up" />
          </>
        )}
      </div>
    </nav>
  )
}
