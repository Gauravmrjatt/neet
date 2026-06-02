'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.errors?.[0]?.message || 'Invalid email or password')
        setLoading(false)
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 400, padding: 24 }}>
      <div
        style={{
          background: 'rgb(20, 20, 20)',
          border: '1px solid rgb(60, 60, 60)',
          borderRadius: 8,
          padding: 32,
        }}
      >
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 24,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Sign In
        </h1>
        <p
          style={{
            margin: '0 0 24px',
            fontSize: 14,
            color: 'rgb(160, 160, 160)',
            textAlign: 'center',
          }}
        >
          Enter your credentials to continue
        </p>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              marginBottom: 16,
              background: 'rgb(60, 20, 20)',
              border: '1px solid rgb(120, 40, 40)',
              borderRadius: 4,
              color: 'rgb(255, 100, 100)',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgb(0, 0, 0)',
                border: '1px solid rgb(60, 60, 60)',
                borderRadius: 4,
                color: 'rgb(255, 255, 255)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgb(0, 0, 0)',
                border: '1px solid rgb(60, 60, 60)',
                borderRadius: 4,
                color: 'rgb(255, 255, 255)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 0',
              background: loading ? 'rgb(80, 80, 80)' : 'rgb(255, 255, 255)',
              color: 'rgb(0, 0, 0)',
              border: 'none',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
