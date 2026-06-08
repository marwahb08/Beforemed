'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

type CriterionResult = {
  score: number
  comment: string
}

type ScoreResult = {
  score: number
  careerFit: string
  summary: string
  strengths: string[]
  improvements: string[]
  criteria: {
    historyTaking: CriterionResult
    clinicalReasoning: CriterionResult
    communication: CriterionResult
    urgencyRecognition: CriterionResult
    completeness: CriterionResult
  }
}

const CRITERIA_LABELS: Record<string, string> = {
  historyTaking: 'History Taking',
  clinicalReasoning: 'Clinical Reasoning',
  communication: 'Communication',
  urgencyRecognition: 'Urgency Recognition',
  completeness: 'Completeness',
}

const FIT_COLORS: Record<string, string> = {
  'Excellent Fit': '#00c27a',
  'Strong Fit': '#3b82f6',
  'Moderate Fit': '#f59e0b',
  'Explore Other Paths': '#ef4444',
}

export default function ResultsClient() {
  const router = useRouter()
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchScore() {
      const rawMessages = sessionStorage.getItem('sim_messages')
      const specialty = sessionStorage.getItem('sim_specialty') ?? 'surgery'

      if (!rawMessages) {
        router.push('/dashboard')
        return
      }

      try {
        const messages = JSON.parse(rawMessages)
        const res = await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, specialty }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setResult(data)
      } catch (e) {
        setError('Could not generate score. Please try again.')
        console.error(e)
      }
      setLoading(false)
    }

    fetchScore()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#00c27a] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Evaluating your performance...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-400">{error}</p>
        <Link href="/dashboard" className="text-[#00c27a] text-sm">← Back to dashboard</Link>
      </div>
    )
  }

  if (!result) return null

  const fitColor = FIT_COLORS[result.careerFit] ?? '#00c27a'
  const scoreColor = result.score >= 75 ? '#00c27a' : result.score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#00c27a] flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight text-lg">BeforeMed</span>
        </div>
        <Link href="/dashboard" className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5">
          <RotateCcw size={14} />
          Try another specialty
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Score hero */}
        <div className="text-center mb-12">
          <p className="text-white/40 text-sm mb-4 uppercase tracking-wider">Simulation Complete</p>

          <div
            className="text-8xl font-bold mb-3 tabular-nums"
            style={{ color: scoreColor }}
          >
            {result.score}
            <span className="text-4xl text-white/20">/100</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border mb-6"
            style={{ color: fitColor, borderColor: `${fitColor}30`, background: `${fitColor}15` }}
          >
            {result.careerFit}
          </div>

          <p className="text-white/55 leading-relaxed max-w-xl mx-auto">{result.summary}</p>
        </div>

        {/* Criteria breakdown */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-5">Performance Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(result.criteria).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-white/60">{CRITERIA_LABELS[key]}</span>
                  <span className="text-sm font-mono text-white/80">{val.score}/20</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(val.score / 20) * 100}%`,
                      background: val.score >= 16 ? '#00c27a' : val.score >= 10 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <p className="text-xs text-white/30">{val.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-[#00c27a]" />
              What You Did Well
            </h2>
            <ul className="space-y-2.5">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-white/55 leading-relaxed flex gap-2.5">
                  <span className="text-[#00c27a] mt-0.5 shrink-0">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <XCircle size={16} className="text-red-400" />
              Areas to Improve
            </h2>
            <ul className="space-y-2.5">
              {result.improvements.map((s, i) => (
                <li key={i} className="text-sm text-white/55 leading-relaxed flex gap-2.5">
                  <span className="text-red-400 mt-0.5 shrink-0">−</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 bg-[#00c27a] hover:bg-[#00a868] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Try another specialty
            <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem('sim_messages')
              sessionStorage.removeItem('sim_specialty')
              router.push('/dashboard')
            }}
            className="flex-1 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-medium py-3 rounded-xl text-sm transition-colors"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
