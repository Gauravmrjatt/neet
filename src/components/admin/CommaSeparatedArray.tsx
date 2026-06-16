'use client'

export const CommaSeparatedArray: React.FC<any> = (props) => {
  const { field, value, onChange } = props
  const subFieldName = field?.fields?.[0]?.name || 'value'

  const textValue = Array.isArray(value)
    ? value.map((item) => item[subFieldName]).filter(Boolean).join(', ')
    : ''

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const items = e.target.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ [subFieldName]: s }))
    if (typeof onChange === 'function') {
      onChange(items)
    }
  }

  return (
    <div className="field-type textarea">
      <label className="field-label">
        <span>{field?.label || 'Comma-separated values'}</span>
      </label>
      <textarea
        value={textValue}
        onChange={handleChange}
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
