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
    <div className="w-full bg-white text-xs sm:text-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-2 px-4">
        <div className="text-left">
          <div className="text-gray-600">{leftText}</div>
        </div>
        <div className="text-right">
          <div className="text-gray-600">{rightText}</div>
        </div>
      </div>
    </div>
  )
}
