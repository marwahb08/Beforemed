'use client'

import { useRouter } from 'next/navigation'
import { Activity, Zap, Scissors, Stethoscope, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const specialties = [
  {
    id: 'emergency',
    name: 'Emergency Medicine',
    icon: Zap,
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.1)',
    description: 'You arrive to a critically unstable patient. Seconds matter. Can you stabilize them before it\'s too late?',
    difficulty: 'High Pressure',
    time: '~10 min',
  },
  {
    id: 'surgery',
    name: 'Surgery',
    icon: Scissors,
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.1)',
    description: 'A patient presents with acute abdominal pain. Assess the case and determine if surgical intervention is needed.',
    difficulty: 'Technical',
    time: '~10 min',
  },
  {
    id: 'general',
    name: 'General Practice',
    icon: Stethoscope,
    color: '#00c27a',
    bgColor: 'rgba(0,194,122,0.1)',
    description: 'A patient walks in with vague but concerning symptoms. Your job: listen, assess, and decide next steps.',
    difficulty: 'Diagnostic',
    time: '~10 min',
  },
]

export default function DashboardClient({ user }: { user: User }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function startSimulation(specialty: string) {
    router.push(`/simulation?specialty=${specialty}`)
  }

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
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40 hidden sm:block">{user.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Choose a Specialty</h1>
          <p className="text-white/45">Each simulation is based on a real clinical case. Pick the one you want to explore.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {specialties.map((spec) => {
            const Icon = spec.icon
            return (
              <div
                key={spec.id}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col hover:border-white/15 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: spec.bgColor }}
                >
                  <Icon size={20} style={{ color: spec.color }} />
                </div>

                <h2 className="font-semibold text-white text-lg mb-2">{spec.name}</h2>
                <p className="text-sm text-white/45 leading-relaxed flex-1 mb-5">{spec.description}</p>

                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/8">
                    {spec.difficulty}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/8">
                    {spec.time}
                  </span>
                </div>

                <button
                  onClick={() => startSimulation(spec.id)}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-all border"
                  style={{
                    background: spec.bgColor,
                    color: spec.color,
                    borderColor: `${spec.color}30`,
                  }}
                >
                  Begin Simulation →
                </button>
              </div>
            )
          })}
        </div>

        {/* Info strip */}
        <div className="mt-10 bg-white/[0.02] border border-white/5 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <Activity size={16} className="text-[#00c27a] shrink-0" />
          <p className="text-sm text-white/35">
            Each simulation gives you up to <strong className="text-white/60">30 messages</strong> to assess the patient. Your conversation is scored after submission.
          </p>
        </div>
      </main>
    </div>
  )
}
