'use client'

import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import type { TurnstileWidgetHandle } from '@/components/shared/TurnstileWidget'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirect') || '/my-plan'
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/my-plan'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

      // Step 1: Create the user
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.errors?.[0]?.message || 'Failed to create account')
        turnstileRef.current?.reset()
        setLoading(false)
        return
      }

      // Step 2: Auto-login after successful registration
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!loginRes.ok) {
        // Account created but login failed — redirect to login page
        router.push('/login?redirect=' + encodeURIComponent(redirect))
        return
      }

      router.push(redirect)
      router.refresh()
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

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

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
          <h1 className="text-2xl font-bold text-primary-navy">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Join us for expert NEET counselling guidance
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary-navy">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Your full name"
            />
          </div>

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
            <Label htmlFor="phone" className="text-primary-navy">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary-navy">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-primary-navy">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary-navy font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-navy" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
