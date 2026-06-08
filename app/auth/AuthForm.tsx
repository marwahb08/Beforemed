'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') setMode('signup')
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email to confirm your account, then log in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-7 h-7 rounded-full bg-[#00c27a] flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">BeforeMed</span>
        </Link>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
          <div className="flex bg-white/5 rounded-lg p-1 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'login' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'signup' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00c27a]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00c27a]/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {message && (
              <p className="text-[#00c27a] text-sm bg-[#00c27a]/10 border border-[#00c27a]/20 rounded-lg px-3 py-2">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00c27a] hover:bg-[#00a868] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors mt-2"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/25 text-xs mt-6">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
