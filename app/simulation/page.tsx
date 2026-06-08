import { Suspense } from 'react'
import SimulationClient from './SimulationClient'

export default function SimulationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#00c27a] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SimulationClient />
    </Suspense>
  )
}
