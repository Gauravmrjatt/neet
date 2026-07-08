'use client'

export default function CounsellingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  void error
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-primary-navy mb-2">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t load the counselling guides. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center rounded-lg bg-primary-navy px-6 py-3 text-white font-semibold hover:bg-primary-navy/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
