'use client'

import { useField } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

export const VideoCategorySelect: React.FC<any> = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/globals/video-categories')
        const data = await res.json()
        const items = data?.items || []
        setOptions(items)
      } catch (err) {
        console.error('Failed to load video categories', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOptions()
  }, [])

  return (
    <div className="field-type text">
      <label className="field-label">
        <span>Category</span>
      </label>
      {loading ? (
        <div className="text-muted-foreground text-sm">Loading categories...</div>
      ) : (
        <select
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          className="custom-select"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-300)',
            background: 'var(--theme-input-bg)',
            color: 'var(--theme-text)',
            fontSize: '1rem',
          }}
        >
          <option value="">Select a category</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
