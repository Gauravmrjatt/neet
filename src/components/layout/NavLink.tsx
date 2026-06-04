'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  label: string
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 text-xs sm:text-sm transition-colors ${
        isActive
          ? 'text-black font-bold'
          : 'hover:bg-[#e8e4de]'
      }`}
      style={isActive ? { backgroundColor: 'rgb(251, 172, 26)' } : undefined}
    >
      {label}
    </Link>
  )
}
