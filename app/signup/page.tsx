'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Activity, User, Mail, Lock, ChevronDown, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Gulf countries first, then rest alphabetically
const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'QA', name: 'Qatar' },
  { code: 'OM', name: 'Oman' },
  { code: '──', name: '──────────────', disabled: true },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EG', name: 'Egypt' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LY', name: 'Libya' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'MA', name: 'Morocco' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PS', name: 'Palestine' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
]

type FieldErrors = {
  fullName?: string
  email?: string
  password?: string
  country?: string
  general?: string
}

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!fullName.trim()) e.fullName = 'Full name is required.'
    if (!email.trim()) e.email = 'Email is required.'
    if (!password) e.password = 'Password is required.'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (!country) e.country = 'Please select your country.'
    return e
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const supabase = createClient()

    // Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, country },
      },
    })

    if (signUpError) {
      const msg = signUpError.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('email')) {
        setErrors({ email: 'An account with this email already exists.' })
      } else if (msg.includes('password')) {
        setErrors({ password: signUpError.message })
      } else {
        setErrors({ general: signUpError.message })
      }
      setLoading(false)
      return
    }

    // Insert profile row
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        country,
        email,
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  const inputClass = (hasError: boolean) =>
    `w-full bg-white/[0.04] border rounded-xl py-3 text-white placeholder-white/20 text-sm focus:outline-none transition-all ${
      hasError
        ? 'border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20'
        : 'border-white/[0.09] focus:border-[#00c27a]/60 focus:ring-1 focus:ring-[#00c27a]/30'
    }`

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 py-12">
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

          <h1 className="text-xl font-semibold text-white text-center mb-1">Create your account</h1>
          <p className="text-sm text-white/40 text-center mb-8">Start exploring medicine for free</p>

          {/* General error */}
          {errors.general && (
            <div className="flex items-start gap-2.5 bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4" noValidate>

            {/* Full name */}
            <div>
              <label className="block text-sm text-white/50 mb-1.5 font-medium">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => { setFullName(e.target.value); setErrors(prev => ({ ...prev, fullName: '' })) }}
                  placeholder="Your full name"
                  autoComplete="name"
                  className={`${inputClass(!!errors.fullName)} pl-10 pr-4`}
                />
              </div>
              {errors.fullName && <FieldError msg={errors.fullName} />}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-white/50 mb-1.5 font-medium">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`${inputClass(!!errors.email)} pl-10 pr-4`}
                />
              </div>
              {errors.email && <FieldError msg={errors.email} />}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/50 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`${inputClass(!!errors.password)} pl-10 pr-4`}
                />
              </div>
              {errors.password && <FieldError msg={errors.password} />}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm text-white/50 mb-1.5 font-medium">Country</label>
              <div className="relative">
                <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <select
                  value={country}
                  onChange={e => { setCountry(e.target.value); setErrors(prev => ({ ...prev, country: '' })) }}
                  className={`${inputClass(!!errors.country)} pl-4 pr-10 appearance-none cursor-pointer ${!country ? 'text-white/20' : 'text-white'}`}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <option value="" disabled className="bg-[#0f1729] text-white/40">Select your country</option>
                  {COUNTRIES.map((c, i) =>
                    c.disabled ? (
                      <option key={i} disabled className="bg-[#0f1729] text-white/20">{c.name}</option>
                    ) : (
                      <option key={c.code} value={c.name} className="bg-[#0f1729] text-white">{c.name}</option>
                    )
                  )}
                </select>
              </div>
              {errors.country && <FieldError msg={errors.country} />}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00c27a] hover:bg-[#00ad6d] active:bg-[#009960] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#00c27a]/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>

          </form>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-white/35 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00c27a] hover:text-[#00d988] font-medium transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
      <AlertCircle size={12} />
      {msg}
    </p>
  )
}
