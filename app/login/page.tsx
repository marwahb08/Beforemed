'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Activity, Mail, Lock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.message
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-[#0f1729] border border-white/[0.07] rounded-2xl px-8 py-10 shadow-2xl shadow-black/40">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#00c27a] flex items-center justify-center shadow-lg shadow-[#00c27a]/25">
              <Activity size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">BeforeMed</span>
          </div>

          <h1 className="text-xl font-semibold text-white text-center mb-1">Welcome back</h1>
          <p className="text-sm text-white/40 text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleSignIn} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-white/50 mb-1.5 font-medium">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00c27a]/60 focus:ring-1 focus:ring-[#00c27a]/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/50 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00c27a]/60 focus:ring-1 focus:ring-[#00c27a]/30 transition-all"
                />
              </div>
            </div>

            {/* Inline error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-sm leading-snug">{error}</p>
              </div>
            )}

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00c27a] hover:bg-[#00ad6d] active:bg-[#009960] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#00c27a]/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            {/* Forgot password */}
            <div className="text-center pt-1">
              <Link
                href="/forgot-password"
                className="text-sm text-white/35 hover:text-white/60 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

          </form>
        </div>

        {/* Create account link */}
        <p className="text-center text-sm text-white/35 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#00c27a] hover:text-[#00d988] font-medium transition-colors">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}
