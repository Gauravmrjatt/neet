'use client'

import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import type { TurnstileWidgetHandle } from '@/components/shared/TurnstileWidget'

function LoginForm() {
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirect') || '/'
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileAwaiting, setTurnstileAwaiting] = useState(false)
  const turnstileRef = useRef<TurnstileWidgetHandle>(null)

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  useEffect(() => {
    if (turnstileAwaiting && turnstileToken) {
      setTurnstileAwaiting(false)
      handleSubmitWithToken(turnstileToken)
    }
  }, [turnstileAwaiting, turnstileToken])

  async function handleSubmitWithToken(token: string) {
    setLoading(true)

    try {
      const verifyRes = await fetch('/api/validate-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.success) {
        setError(verifyData.error || 'Security check failed. Please refresh and try again.')
        turnstileRef.current?.reset()
        setLoading(false)
        return
      }

      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.errors?.[0]?.message || 'Invalid email or password')
        turnstileRef.current?.reset()
        setLoading(false)
        return
      }

      window.location.href = redirect
    } catch {
      setError('Something went wrong. Please try again.')
      turnstileRef.current?.reset()
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading || turnstileAwaiting) return
    setError('')

    const token = turnstileToken || turnstileRef.current?.getToken()
    if (!token) {
      setTurnstileAwaiting(true)
      turnstileRef.current?.execute()
      return
    }

    await handleSubmitWithToken(token)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-xl border border-border shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-navy">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to access your counselling dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary-navy">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-primary-navy">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary-navy hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <TurnstileWidget
            ref={turnstileRef}
            onVerify={handleTurnstileVerify}
            onError={() => setError('Security check unavailable. Please refresh and try again.')}
          />

          <Button
            type="submit"
            disabled={loading || turnstileAwaiting}
            className="w-full bg-button-gold hover:bg-button-gold-hover text-primary-navy font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-primary-navy font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-navy" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
