'use client'

import { useEffect, useState } from 'react'
import { IMPORTER_CONFIGS } from './importerConfig'
import type { ImporterConfig } from './importerConfig'

type SelectOption = {
  id: string
  name: string
}

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '4px',
  border: '1px solid var(--theme-elevation-300)',
  background: 'var(--theme-input-bg)',
  color: 'var(--theme-text)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.85rem',
  lineHeight: '1.5',
  boxSizing: 'border-box',
}

const buttonStyles: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '4px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.85rem',
  color: '#fff',
  background: 'var(--theme-elevation-500)',
  whiteSpace: 'nowrap',
}

export const JsonImporter: React.FC<{ configKey: string }> = ({ configKey }) => {
  const config: ImporterConfig = IMPORTER_CONFIGS[configKey]

  const [copied, setCopied] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [options, setOptions] = useState<SelectOption[]>([])
  const [optionsError, setOptionsError] = useState(false)
  const [saveAsDraft, setSaveAsDraft] = useState(true)

  useEffect(() => {
    if (!config.requireSelect) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(config.requireSelect!.apiPath, { credentials: 'include' })
        const data = await res.json()
        if (!cancelled) setOptions((data.docs || []).map((d: any) => ({ id: d.id, name: d.name })))
      } catch {
        if (!cancelled) setOptionsError(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [config.requireSelect])

  const copyStructure = async () => {
    try {
      await navigator.clipboard.writeText(config.jsonExample)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.getElementById('json-structure-preview') as HTMLTextAreaElement | null
      if (el) {
        el.focus()
        el.select()
        try {
          document.execCommand('copy')
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {}
      }
    }
  }

  const handleImport = async () => {
    setStatus('loading')
    setMessage('')

    let data: any
    try {
      data = JSON.parse(jsonText)
    } catch {
      setStatus('error')
      setMessage('Invalid JSON format. Check your syntax.')
      return
    }

    const missing = config.requiredFields.filter((f) => !data[f])
    if (missing.length > 0) {
      setStatus('error')
      setMessage(`Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.`)
      return
    }

    if (config.requireSelect) {
      if (!selectValue) {
        setStatus('error')
        setMessage(`Select a ${config.requireSelect.label} before importing.`)
        return
      }
      data[config.requireSelect.field] = selectValue
    }

    if (config.h1BlockTypes.length > 0) {
      const h1Blocks = (data.content || []).filter((b: any) =>
        config.h1BlockTypes.includes(b?.blockType),
      )
      if (h1Blocks.length > 1) {
        setStatus('error')
        setMessage(
          `Found ${h1Blocks.length} ${h1Blocks[0].blockType} block(s). A ${config.entityNoun} must have at most ONE for a single H1 (SEO).`,
        )
        return
      }
    }

    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    }

    if (saveAsDraft) {
      data.status = 'draft'
      if (config.hasDrafts) data._status = 'draft'
    }

    if (data.seo?.keywords && Array.isArray(data.seo.keywords)) {
      if (typeof data.seo.keywords[0] === 'string') {
        data.seo.keywords = data.seo.keywords.map((kw: string) => ({ keyword: kw }))
      }
    }

    try {
      const res = await fetch(`/api/${config.apiSlug}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        let errMsg = `Error ${res.status}`
        try {
          const errRes = await res.json()
          errMsg = errRes.errors?.[0]?.message || errRes.message || errMsg
        } catch {}
        throw new Error(errMsg)
      }

      const doc = await res.json()
      const docId = doc.doc?.id || doc.id

      if (docId) {
        window.location.href = `/admin/collections/${config.apiSlug}/${docId}`
      } else {
        setStatus('success')
        setMessage(`${config.entityNoun} created!`)
      }
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message)
    }
  }

  const sectionLabel = config.apiSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div
      style={{
        marginBottom: '1.5rem',
        border: '1px solid var(--theme-elevation-200)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <details>
        <summary
          style={{
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            background: 'var(--theme-elevation-50)',
            borderBottom: '1px solid var(--theme-elevation-200)',
            userSelect: 'none',
          }}
        >
          Copy JSON Structure ({sectionLabel})
        </summary>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <textarea
              id="json-structure-preview"
              readOnly
              value={config.jsonExample}
              rows={7}
              style={{ ...inputStyles, resize: 'vertical', flex: '1 1 auto' }}
            />
            <button onClick={copyStructure} type="button" style={buttonStyles}>
              {copied ? 'Copied ✓' : 'Copy JSON Structure'}
            </button>
          </div>
          <p
            style={{
              margin: '0.75rem 0',
              fontSize: '0.85rem',
              color: 'var(--theme-elevation-600)',
            }}
          >
            Use the JSON structure above as reference, or paste a {config.entityNoun} JSON blob
            below to auto-create it. {config.requiredFields.join(', ')} is required. Slug is
            auto-generated from title if omitted. SEO keywords can be a flat array — they will be
            converted automatically.
          </p>

          {config.requireSelect && (
            <div style={{ marginBottom: '0.75rem' }}>
              <select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                disabled={options.length === 0}
                style={{ ...inputStyles, fontFamily: 'var(--font-body)' }}
              >
                <option value="">
                  {optionsError
                    ? `Could not load ${config.requireSelect.label}s`
                    : options.length === 0
                      ? `Loading ${config.requireSelect.label}s…`
                      : `Select ${config.requireSelect.label}…`}
                </option>
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`{\n  "title": "My ${sectionLabel}",\n  "slug": "my-${config.apiSlug}",\n  "status": "published",\n  "blocks": [...],\n  "seo": { ... }\n}`}
            rows={8}
            style={{ ...inputStyles, resize: 'vertical', marginBottom: '0.75rem' }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              color: 'var(--theme-text)',
            }}
          >
            <input
              id="save-as-draft"
              type="checkbox"
              checked={saveAsDraft}
              onChange={(e) => setSaveAsDraft(e.target.checked)}
              style={{ margin: 0 }}
            />
            <label htmlFor="save-as-draft" style={{ cursor: 'pointer' }}>
              Save as draft
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleImport}
              disabled={!jsonText.trim() || status === 'loading'}
              type="button"
              style={{
                ...buttonStyles,
                background:
                  !jsonText.trim() || status === 'loading'
                    ? 'var(--theme-elevation-200)'
                    : 'var(--theme-success-500)',
                color:
                  !jsonText.trim() || status === 'loading' ? 'var(--theme-elevation-400)' : '#fff',
                cursor: !jsonText.trim() || status === 'loading' ? 'not-allowed' : 'pointer',
              }}
            >
              {status === 'loading' ? 'Creating…' : `Create ${sectionLabel}`}
            </button>

            {status === 'error' && (
              <span style={{ color: 'var(--theme-error-500)', fontSize: '0.85rem' }}>
                {message}
              </span>
            )}

            {status === 'success' && (
              <span style={{ color: 'var(--theme-success-500)', fontSize: '0.85rem' }}>
                {message}
              </span>
            )}
          </div>
        </div>
      </details>
    </div>
  )
}