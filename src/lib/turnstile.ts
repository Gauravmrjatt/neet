const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstileToken(token: string): Promise<{ success: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    console.error('Turnstile secret key not configured')
    return { success: false, error: 'Server configuration error' }
  }

  if (!token) {
    return { success: false, error: 'Missing Turnstile token' }
  }

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })

    const data = await res.json()

    if (!data.success) {
      const errorCodes = data['error-codes']
      const message = errorCodes?.length ? errorCodes.join(', ') : 'Verification failed'
      return { success: false, error: message }
    }

    return { success: true }
  } catch (err) {
    console.error('Turnstile verification error:', err)
    return { success: false, error: 'Verification service unavailable' }
  }
}
