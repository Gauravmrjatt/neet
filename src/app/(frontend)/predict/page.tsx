import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Predict Your NEET College | NEET Counselling',
  description: 'Predict your NEET college admission chances using AI.',
}

export default function PredictPage() {
  redirect('/predictor')
}
