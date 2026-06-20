import { getHeader } from '@/lib/queries/globals'
import { NavbarClient } from './NavbarClient'

export async function Navbar() {
  const headerData = await getHeader()
  const navItems = headerData.navigation || []
  const ctaButton = headerData.ctaButton

  return <NavbarClient navItems={navItems} ctaButton={ctaButton} />
}
