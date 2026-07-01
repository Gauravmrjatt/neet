'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.errors?.[0]?.message || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      setSent(true)
      setLoading(false)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-10">
            <Image src="favicon.svg" alt="" height={100} width={100} className="m-auto mb-5" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary-navy">Check Your Email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            If an account exists with <strong>{email}</strong>, you will receive password reset
            instructions shortly.
          </p>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary-navy font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mb-10">
          <Image src="favicon.svg" alt="" height={100} width={100} className="m-auto mb-5" />
        </div>
        <h1 className="text-2xl font-bold text-primary-navy">Forgot Password</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your email and we&apos;ll send you reset instructions
        </p>
      </div>

      {error && (
        <div
          className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm"
          role="alert"
        >
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-button-gold hover:bg-button-gold-hover text-primary-navy font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/login" className="text-primary-navy font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
