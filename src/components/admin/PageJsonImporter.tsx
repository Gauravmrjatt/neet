'use client'

import { useState } from 'react'

export const PageJsonImporter: React.FC<any> = () => {
  const [jsonText, setJsonText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleImport = async () => {
    setStatus('loading')
    setMessage('')

    try {
      let data: any
      try {
        data = JSON.parse(jsonText)
      } catch {
        setStatus('error')
        setMessage('Invalid JSON format. Check your syntax.')
        return
      }

      if (!data.title) {
        setStatus('error')
        setMessage('Missing required field: "title".')
        return
      }

      if (!data.slug) {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      }

      if (data.seo?.keywords && Array.isArray(data.seo.keywords)) {
        if (typeof data.seo.keywords[0] === 'string') {
          data.seo.keywords = data.seo.keywords.map((kw: string) => ({ keyword: kw }))
        }
      }

      const res = await fetch('/api/pages', {
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

      const page = await res.json()
      const pageId = page.doc?.id || page.id

      if (pageId) {
        window.location.href = `/admin/collections/pages/${pageId}`
      } else {
        setStatus('success')
        setMessage('Page created!')
      }
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message)
    }
  }

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
          Quick Import from JSON
        </summary>
        <div style={{ padding: '1rem' }}>
          <p
            style={{
              margin: '0 0 0.75rem',
              fontSize: '0.85rem',
              color: 'var(--theme-elevation-600)',
            }}
          >
            Paste a page JSON blob to auto-create a page. Title is required.
            Slug is auto-generated from title if omitted. SEO keywords can be a
            flat array — they will be converted automatically.
          </p>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`{\n  "title": "My Page",\n  "slug": "my-page",\n  "status": "published",\n  "content": [...],\n  "seo": { ... }\n}`}
            rows={8}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid var(--theme-elevation-300)',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              resize: 'vertical',
              marginBottom: '0.75rem',
              boxSizing: 'border-box',
            }}
          />

          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <button
              onClick={handleImport}
              disabled={!jsonText.trim() || status === 'loading'}
              type="button"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '4px',
                border: 'none',
                background:
                  !jsonText.trim() || status === 'loading'
                    ? 'var(--theme-elevation-200)'
                    : 'var(--theme-success-500)',
                color:
                  !jsonText.trim() || status === 'loading'
                    ? 'var(--theme-elevation-400)'
                    : '#fff',
                fontWeight: 600,
                cursor: !jsonText.trim() || status === 'loading' ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {status === 'loading' ? 'Creating…' : 'Create Page'}
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
