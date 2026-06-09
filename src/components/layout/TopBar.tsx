import { Building2, Landmark } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'

export async function TopBar() {
  const payload = await getPayloadClient()
  let settings: any = {}
  try {
    settings = await payload.findGlobal({ slug: 'site-settings' })
  } catch {}

  const topBar = settings?.topBar || {}
  const leftText = topBar.leftText || 'भारत सरकार / Government of India'
  const rightText = topBar.rightText || 'शिक्षा मंत्रालय / Ministry of Education'

  return (
    <div
      role="region"
      aria-label="Government affiliation"
      className="w-full bg-navbar-bg/90 text-primary border-b border-border/70 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl  items-center justify-between gap-1 px-4 py-2 text-[11px] font-medium tracking-wide flex-row sm:text-xs">
        <div className="flex items-center gap-2 text-primary/80 transition-colors hover:text-primary">
          {/* <Landmark className="h-3.5 w-3.5 text-button-gold" aria-hidden="true" /> */}
          <span className="font-semibold">{leftText}</span>
        </div>
        <div className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
        <div className="flex items-center gap-2 text-primary/80 transition-colors hover:text-primary">
          {/* <Building2 className="h-3.5 w-3.5 text-button-gold" aria-hidden="true" /> */}
          <span className="font-semibold">{rightText}</span>
        </div>
      </div>
    </div>
  )
}
