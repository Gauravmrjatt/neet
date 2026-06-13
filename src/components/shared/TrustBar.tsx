interface TrustItem {
  label: string
  value: string
}

interface TrustBarProps {
  items: TrustItem[]
}

export function TrustBar({ items }: TrustBarProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="bg-primary-navy/5 rounded-xl border border-border p-6">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-2xl font-bold text-primary-navy">{item.value}</p>
            <p className="text-sm text-foreground/70 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
