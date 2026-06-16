'use client'

import { useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

export const CommaSeparatedArray: React.FC<any> = (props) => {
  const { path, field } = props
  const { setValue } = useField<any[]>({ path })
  const subFieldName = field?.fields?.[0]?.name || 'value'

  const fieldState = useFormFields(([fields]) => fields[path])

  const rawValue = fieldState?.value
  const arrValue = Array.isArray(rawValue) ? rawValue : []

  const formText = arrValue
    .map((item: any) => item[subFieldName])
    .filter(Boolean)
    .join(', ')

  const [dirtyText, setDirtyText] = useState<string | null>(null)

  const displayText = dirtyText !== null ? dirtyText : formText

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDirtyText(e.target.value)
  }

  const handleBlur = () => {
    const text = dirtyText !== null ? dirtyText : formText
    const items = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ [subFieldName]: s }))
    setValue(items)
    setDirtyText(null)
  }

  return (
    <div className="field-type textarea">
      <label className="field-label">
        <span>{field?.label || 'Comma-separated values'}</span>
      </label>
      <textarea
        value={displayText}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={4}
        placeholder="Enter comma-separated values"
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-300)',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          fontFamily: 'inherit',
          fontSize: '1rem',
          lineHeight: '1.5',
          resize: 'vertical',
        }}
      />
    </div>
  )
}
