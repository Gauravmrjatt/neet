'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
      execute: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
    }
  }
}

interface TurnstileRenderOptions {
  sitekey: string
  callback?: (token: string) => void
  'error-callback'?: () => void
  'expired-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  tabindex?: number
  'response-field'?: boolean
  'response-field-name'?: string
  retry?: 'auto' | 'never'
  'retry-interval'?: number
  'refresh-expired'?: 'auto' | 'manual' | 'never'
  language?: string
  execution?: 'render' | 'execute'
}

export interface TurnstileWidgetHandle {
  execute: () => void
  reset: () => void
  getToken: () => string | null
}

interface TurnstileWidgetProps {
  siteKey?: string
  theme?: 'light' | 'dark' | 'auto'
  onVerify?: (token: string) => void
  onError?: () => void
  onExpired?: () => void
  className?: string
}

function loadTurnstileScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector('script[src*="turnstile/v0/api.js"]')) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget(
    { siteKey, theme = 'auto', onVerify, onError, onExpired, className },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const [ready, setReady] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const tokenRef = useRef<string | null>(null)

    const onVerifyRef = useRef(onVerify)
    onVerifyRef.current = onVerify
    const onErrorRef = useRef(onError)
    onErrorRef.current = onError
    const onExpiredRef = useRef(onExpired)
    onExpiredRef.current = onExpired

    const effectiveSiteKey = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

    useImperativeHandle(
      ref,
      () => ({
        execute: () => {
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.execute(widgetIdRef.current)
          }
        },
        reset: () => {
          tokenRef.current = null
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current)
          }
        },
        getToken: () => tokenRef.current,
      }),
      [],
    )

    useEffect(() => {
      if (!effectiveSiteKey) return

      let widgetId: string | null = null

      async function init() {
        const loaded = await loadTurnstileScript()
        if (!loaded || !window.turnstile || !containerRef.current) {
          setLoadError(true)
          return
        }

        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: effectiveSiteKey,
          theme,
          'response-field': false,
          execution: 'render',
          callback: (token: string) => {
            tokenRef.current = token
            onVerifyRef.current?.(token)
          },
          'error-callback': () => {
            tokenRef.current = null
            onErrorRef.current?.()
          },
          'expired-callback': () => {
            tokenRef.current = null
            onExpiredRef.current?.()
          },
        })

        widgetIdRef.current = widgetId
        setReady(true)
      }

      init()

      return () => {
        if (widgetId && window.turnstile) {
          window.turnstile.remove(widgetId)
        }
      }
    }, [effectiveSiteKey, theme])

    if (!effectiveSiteKey) {
      return null
    }

    return (
      <div className={className}>
        {loadError && (
          <p className="text-xs text-destructive">Security check unavailable. Please refresh and try again.</p>
        )}
        <div
          ref={containerRef}
          className={`overflow-hidden ${ready ? 'min-h-[65px]' : 'h-[65px]'}`}
          data-testid="turnstile-widget"
        />
      </div>
    )
  },
)

export { TurnstileWidget }
export default TurnstileWidget
