'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Activity, Send, AlertTriangle, Heart, Thermometer, Wind, Droplets, CalendarClock, Sparkles, Lock, Check } from 'lucide-react'

const MAX_MESSAGES = 30
const WARNING_THRESHOLD = 25

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const PATIENT_INFO: Record<string, {
  name: string
  vitals: { bp: string; hr: string; temp: string; rr: string; spo2: string } | null
  badge: string
  isMultiStage?: boolean
  stages?: string[]
}> = {
  surgery: {
    name: 'Khalid Al Mansoori',
    vitals: { bp: '128/82', hr: '98', temp: '38.2°C', rr: '16', spo2: '99%' },
    badge: 'Surgical Assessment Unit',
  },
  emergency: {
    name: 'Amira Hassan',
    vitals: { bp: '110/70', hr: '118', temp: '37.1°C', rr: '28', spo2: '91%' },
    badge: 'Emergency Department',
  },
  general: {
    name: 'David Okonkwo',
    vitals: { bp: '138/88', hr: '82', temp: '36.9°C', rr: '14', spo2: '98%' },
    badge: 'General Practice',
  },
  'surgeon-day': {
    name: 'Rashid Hospital, Dubai',
    vitals: null,
    badge: 'General Surgery — Day Simulation',
    isMultiStage: true,
    stages: ['Ward Round', 'Pre-Op Checklist', 'The Operation', 'Breaking Bad News', 'Debrief'],
  },
}

export default function SimulationClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const specialty = searchParams.get('specialty') ?? 'surgery'
  const patient = PATIENT_INFO[specialty] ?? PATIENT_INFO.surgery

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userMessageCount, setUserMessageCount] = useState(0)
  const [ended, setEnded] = useState(false)
  const [hitLimit, setHitLimit] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    // Opening message from patient
    setMessages([{
      role: 'assistant',
      content: getOpeningMessage(specialty),
    }])
  }, [specialty])

  async function sendMessage() {
    if (!input.trim() || loading || ended) return

    const newCount = userMessageCount + 1
    const userMsg: Message = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setInput('')
    setUserMessageCount(newCount)
    setLoading(true)

    if (newCount >= MAX_MESSAGES) {
      // Used up all free messages — persist progress and show the upgrade gate.
      // We do NOT auto-redirect; the student chooses to see results or upgrade.
      persist(updatedMessages)
      setEnded(true)
      setHitLimit(true)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, specialty }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '(Connection error — please try again.)' }])
    }

    setLoading(false)
  }

  function persist(finalMessages: Message[]) {
    sessionStorage.setItem('sim_messages', JSON.stringify(finalMessages))
    sessionStorage.setItem('sim_specialty', specialty)
  }

  function goToResults() {
    router.push('/results')
  }

  function handleEndEarly() {
    persist(messages)
    goToResults()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const remaining = MAX_MESSAGES - userMessageCount
  const isWarning = userMessageCount >= WARNING_THRESHOLD

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#00c27a] flex items-center justify-center">
            <Activity size={12} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">BeforeMed</span>
        </div>

        <div className="flex items-center gap-3">
          {isWarning && (
            <div className="flex items-center gap-1.5 text-amber-400 text-xs bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full animate-pulse">
              <AlertTriangle size={12} />
              The patient&apos;s condition is deteriorating...
            </div>
          )}
          <div className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
            isWarning
              ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
              : 'text-white/40 border-white/10 bg-white/5'
          }`}>
            {remaining} / {MAX_MESSAGES} free messages
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Patient badge */}
          <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-white/5 bg-white/[0.015] shrink-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              patient.isMultiStage
                ? 'bg-[#a78bfa]/15 text-[#a78bfa]'
                : 'bg-[#1e3a5f] text-[#7eb8f7]'
            }`}>
              {patient.isMultiStage ? <CalendarClock size={16} /> : patient.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{patient.name}</p>
              <p className="text-xs text-white/35">{patient.badge}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full animate-pulse ${patient.isMultiStage ? 'bg-[#a78bfa]' : 'bg-[#00c27a]'}`} />
              <span className={`text-xs ${patient.isMultiStage ? 'text-[#a78bfa]' : 'text-[#00c27a]'}`}>Active</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-1 shrink-0 ${
                    patient.isMultiStage ? 'bg-[#a78bfa]/15 text-[#a78bfa]' : 'bg-[#1e3a5f] text-[#7eb8f7]'
                  }`}>
                    {patient.isMultiStage ? <CalendarClock size={13} /> : patient.name.charAt(0)}
                  </div>
                )}
                <div
                  className={`max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#00c27a] text-white rounded-br-sm'
                      : 'bg-white/[0.06] text-white/85 rounded-bl-sm border border-white/5'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-1 shrink-0 ${
                  patient.isMultiStage ? 'bg-[#a78bfa]/15 text-[#a78bfa]' : 'bg-[#1e3a5f] text-[#7eb8f7]'
                }`}>
                  {patient.isMultiStage ? <CalendarClock size={13} /> : patient.name.charAt(0)}
                </div>
                <div className="bg-white/[0.06] border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {ended && !hitLimit && (
              <div className="text-center py-4">
                <p className="text-white/40 text-sm">Simulation ended. Generating your results...</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!ended && (
            <div className="px-4 md:px-6 py-4 border-t border-white/5 shrink-0">
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={patient.isMultiStage ? 'What do you do...' : 'Talk to the patient...'}
                  rows={1}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-[#00c27a]/40 transition-colors min-h-[46px] max-h-32"
                  style={{ height: 'auto' }}
                  onInput={e => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = `${Math.min(target.scrollHeight, 128)}px`
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 rounded-xl bg-[#00c27a] hover:bg-[#00a868] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
                >
                  <Send size={16} className="text-white" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-white/20 text-xs">Enter to send · Shift+Enter for new line</p>
                <button
                  onClick={handleEndEarly}
                  className="text-white/25 hover:text-white/50 text-xs transition-colors"
                >
                  End & get results →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <aside className="hidden lg:flex flex-col w-64 border-l border-white/5 bg-white/[0.015] p-5 shrink-0">
          {patient.isMultiStage ? (
            <>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Stages</h3>
              <div className="space-y-2">
                {patient.stages?.map((stage, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      i === 0 ? 'bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30' : 'bg-white/5 text-white/25 border border-white/8'
                    }`}>{i + 1}</div>
                    <span className={`text-xs ${i === 0 ? 'text-white/70' : 'text-white/25'}`}>{stage}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/5">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">What to expect</h3>
                <ul className="space-y-2 text-xs text-white/30 leading-relaxed">
                  <li>• You play the surgeon throughout</li>
                  <li>• Characters switch between stages</li>
                  <li>• Tasks are scored out of 10</li>
                  <li>• Final debrief with career rating</li>
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarClock size={13} className="text-[#a78bfa]" />
                  <span className="text-xs text-white/40">Multi-stage · ~20 min</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Patient Vitals</h3>
              <div className="space-y-3">
                {patient.vitals && <>
                  <VitalRow icon={<Heart size={13} />} label="Blood Pressure" value={patient.vitals.bp} />
                  <VitalRow icon={<Activity size={13} />} label="Heart Rate" value={`${patient.vitals.hr} bpm`} />
                  <VitalRow icon={<Thermometer size={13} />} label="Temperature" value={patient.vitals.temp} />
                  <VitalRow icon={<Wind size={13} />} label="Resp. Rate" value={`${patient.vitals.rr} /min`} />
                  <VitalRow icon={<Droplets size={13} />} label="SpO₂" value={patient.vitals.spo2} />
                </>}
              </div>

              <div className="mt-6 pt-5 border-t border-white/5">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tips</h3>
                <ul className="space-y-2 text-xs text-white/30 leading-relaxed">
                  <li>• Ask about onset & duration</li>
                  <li>• Check pain character & radiation</li>
                  <li>• Ask about associated symptoms</li>
                  <li>• Take a medication history</li>
                  <li>• Ask about allergies</li>
                </ul>
              </div>
            </>
          )}

          <div className="mt-auto pt-5 border-t border-white/5">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Progress</h3>
            <div className="flex justify-between text-xs text-white/35 mb-1.5">
              <span>Messages used</span>
              <span>{userMessageCount} / {MAX_MESSAGES}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isWarning ? 'bg-amber-400' : patient.isMultiStage ? 'bg-[#a78bfa]' : 'bg-[#00c27a]'}`}
                style={{ width: `${(userMessageCount / MAX_MESSAGES) * 100}%` }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Upgrade gate — shown when all free messages are used up */}
      {hitLimit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1e]/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-[#0d1426] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#a78bfa]/15 border border-[#a78bfa]/25 flex items-center justify-center mx-auto mb-5">
              <Sparkles size={26} className="text-[#a78bfa]" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">You&apos;ve used all 30 free messages</h2>
            <p className="text-sm text-white/45 leading-relaxed mb-6">
              You&apos;ve reached the limit for this simulation. Upgrade to <span className="text-white/70 font-medium">BeforeMed Pro</span> for unlimited conversations and deeper case practice.
            </p>

            <div className="text-left bg-white/[0.03] border border-white/8 rounded-xl p-4 mb-6 space-y-2.5">
              <ProFeature label="Unlimited messages per simulation" />
              <ProFeature label="Every specialty &amp; multi-stage case" />
              <ProFeature label="Detailed performance feedback" />
            </div>

            <button
              onClick={() => alert('Pro plans are coming soon!')}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-[#a78bfa] hover:bg-[#9575f0] text-white transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <Lock size={15} />
              Upgrade to Pro
            </button>
            <button
              onClick={goToResults}
              className="w-full py-2.5 text-sm font-medium text-white/55 hover:text-white/80 transition-colors"
            >
              See your results →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProFeature({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-4 h-4 rounded-full bg-[#a78bfa]/20 flex items-center justify-center shrink-0">
        <Check size={11} className="text-[#a78bfa]" />
      </div>
      <span className="text-xs text-white/55">{label}</span>
    </div>
  )
}

function VitalRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/35">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xs font-mono text-white/70">{value}</span>
    </div>
  )
}

function getOpeningMessage(specialty: string) {
  const openings: Record<string, string> = {
    surgery: "Doctor? Thank god you're here. I've been in this pain for hours... it started after dinner and it just keeps getting worse. It's on my right side, kind of lower down. What's going on with me?",
    emergency: "I... can't breathe properly... it started... about an hour ago. My chest is so tight. I have asthma... but I don't have my inhaler...",
    general: "Good morning, doctor. I appreciate you seeing me. I've been putting this off for a while, but my wife insisted I come in. I've just been feeling really run down lately — tired all the time, losing weight without trying. I thought it was just work stress.",
    'surgeon-day': `6:52am. Your alarm goes off.

You are a general surgeon at Rashid Hospital, Dubai. You have three operations today. The first one is at 10am — a routine gallbladder removal. Routine, until it isn't.

Your registrar knocks on your office door.
"The ward round starts in 8 minutes. Mr. Hassan in bed 4 wants to speak to the surgeon before theatre. His wife called three times last night."

What do you do first?`,
  }
  return openings[specialty] ?? openings.surgery
}
