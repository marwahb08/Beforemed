'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="bg-[#0f1729] border border-white/[0.07] rounded-2xl px-8 py-10 shadow-2xl shadow-black/40">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#00c27a] flex items-center justify-center shadow-lg shadow-[#00c27a]/25">
              <Activity size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">BeforeMed</span>
          </div>

          {submitted ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00c27a]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={22} className="text-[#00c27a]" />
              </div>
              <h1 className="text-lg font-semibold text-white mb-2">Check your email</h1>
              <p className="text-sm text-white/45 leading-relaxed mb-6">
                We sent a password reset link to <span className="text-white/70">{email}</span>. It expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="text-sm text-[#00c27a] hover:text-[#00d988] font-medium transition-colors"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-white text-center mb-1">Reset your password</h1>
              <p className="text-sm text-white/40 text-center mb-8">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1.5 font-medium">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#00c27a]/60 focus:ring-1 focus:ring-[#00c27a]/30 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00c27a] hover:bg-[#00ad6d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#00c27a]/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>

        {!submitted && (
          <p className="text-center text-sm text-white/35 mt-6">
            Remembered it?{' '}
            <Link href="/login" className="text-[#00c27a] hover:text-[#00d988] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        )}

      </div>
    </div>
  )
}
