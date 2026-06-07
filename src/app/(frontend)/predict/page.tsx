import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Predict Your NEET College',
    description: 'Predict your NEET college admission chances using AI.',
  })
}

export default function PredictPage() {
  redirect('/predictor')
}
