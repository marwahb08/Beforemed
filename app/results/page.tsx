import { Suspense } from 'react'
import ResultsClient from './ResultsClient'

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#00c27a] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Evaluating your session...</p>
      </div>
    }>
      <ResultsClient />
    </Suspense>
  )
}
