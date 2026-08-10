'use client'

import { useRowLabel } from '@payloadcms/ui'

const OP_LABELS: Record<string, string> = {
  create: 'Add',
  read: 'Read',
  update: 'Edit',
  delete: 'Delete',
}

export const PermissionRowLabel: React.FC = () => {
  const { data } = useRowLabel<{
    slug?: string
    create?: boolean
    read?: boolean
    update?: boolean
    delete?: boolean
  }>()

  const slug = data?.slug ? data.slug.replace(/-/g, ' ') : 'Collection'

  const ops = (['create', 'read', 'update', 'delete'] as const)
    .filter((op) => data?.[op])
    .map((op) => OP_LABELS[op])

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
      <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{slug}</span>
      {ops.length > 0 && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--theme-elevation-500)',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          }}
        >
          {ops.join(' · ')}
        </span>
      )}
    </div>
  )
}