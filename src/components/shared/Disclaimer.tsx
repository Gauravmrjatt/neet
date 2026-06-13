import { AlertTriangle } from 'lucide-react'

interface DisclaimerProps {
  type?: 'medical' | 'educational' | 'general'
}

const DISCLAIMERS = {
  medical: {
    title: 'Medical Information Disclaimer',
    text: 'The content on this website is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions regarding medical conditions.',
  },
  educational: {
    title: 'Educational Guidance Disclaimer',
    text: 'The counselling information, college data, cutoffs, and admission guidance provided on this website are based on publicly available sources and expert analysis. While we strive for accuracy, admission criteria and processes may change. Verify all information with official counselling authorities before making decisions.',
  },
  general: {
    title: 'Disclaimer',
    text: 'The information provided on this website is for general informational purposes only. We recommend verifying all details with official sources.',
  },
}

export function Disclaimer({ type = 'educational' }: DisclaimerProps) {
  const disclaimer = DISCLAIMERS[type]
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-3" role="note">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
      <div>
        <strong>{disclaimer.title}:</strong> {disclaimer.text}
      </div>
    </div>
  )
}
