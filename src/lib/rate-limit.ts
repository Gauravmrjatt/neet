/**
 * Minimal sliding-window rate limiter backed by an in-memory Map.
 *
 * Suitable for a single Node.js process (single Next.js instance).
 * If you scale to multiple replicas, swap for a Redis-backed store
 * (e.g. @upstash/ratelimit) and expose the same `checkLimit` signature.
 *
 * Stale entries are purged lazily on each `checkLimit` call when the
 * map grows beyond 10 000 keys.
 */

interface WindowEntry {
  timestamps: number[]  // millisecond timestamps of recent hits
}

const store = new Map<string, WindowEntry>()

const PURGE_THRESHOLD = 10_000

export interface LimitConfig {
  /** Maximum number of allowed requests inside the window. */
  limit: number
  /** Window width in milliseconds (e.g. 60 * 60 * 1000 = 1 hour). */
  windowMs: number
}

export interface LimitResult {
  allowed: boolean
  /** Number of remaining requests in the current window. */
  remaining: number
  /** Seconds until the oldest request in the window expires (0 when allowed). */
  retryAfterSeconds: number
}

/**
 * Enforce a sliding-window rate limit for `key` (typically an IP address).
 *
 * Call once per request **before** doing expensive work. When `allowed` is
 * false the caller should short-circuit with HTTP 429.
 */
export function checkLimit(key: string, config: LimitConfig): LimitResult {
  const now = Date.now()
  const { limit, windowMs } = config
  const windowStart = now - windowMs

  let entry = store.get(key)

  // Lazy purge when map is oversized (runs in < 1 ms on a cold path)
  if (store.size > PURGE_THRESHOLD) {
    const cutoff = now - windowMs
    for (const [k, v] of store) {
      // If the most recent timestamp is older than the window, the entry
      // is fully stale and can be removed.
      if (v.timestamps.length === 0 || v.timestamps[v.timestamps.length - 1] < cutoff) {
        store.delete(k)
      }
    }
  }

  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // Drop timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart)

  if (entry.timestamps.length >= limit) {
    // Calculate when the oldest request in the window will expire
    const oldest = entry.timestamps[0]
    const retryAfterMs = oldest + windowMs - now
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(Math.max(retryAfterMs, 1) / 1000),
    }
  }

  entry.timestamps.push(now)
  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    retryAfterSeconds: 0,
  }
}

/**
 * Extract the best-effort client IP from request headers.
 * Falls back to a generic identifier when running behind a single proxy.
 */
export function extractClientIp(request: Request): string {
  // Prefer the left-most value in X-Forwarded-For (original client).
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  // Fallback — same bucket for everyone (safe, just less granular)
  return 'global'
}
