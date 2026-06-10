import { MOCK_SCORES } from '@/lib/mockResponses'
import { SCORING_PROMPT } from '@/lib/systemPrompts'
import { claudeEnabled, getAnthropic, extractText, CHAT_MODEL } from '@/lib/anthropic'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

type CriterionResult = { score: number; comment: string }
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

export async function POST(request: Request) {
  const { messages, specialty } = await request.json()

  // --- Real Claude path -----------------------------------------------------
  if (claudeEnabled()) {
    try {
      const completion = await getAnthropic().messages.create({
        model: CHAT_MODEL,
        max_tokens: 1500,
        system: SCORING_PROMPT,
        messages: [{ role: 'user', content: buildTranscript(messages, specialty) }],
      })
      const parsed = parseScore(extractText(completion))
      if (parsed) return Response.json(parsed)
      console.error('[score] Could not parse Claude JSON — falling back to mock.')
    } catch (err) {
      console.error('[score] Claude API error, falling back to mock:', err)
    }
  }

  // --- Mock path (no key configured, the API failed, or unparseable JSON) ---
  const userMessages = (messages as ChatMessage[]).filter((m) => m.role === 'user')
  const count = userMessages.length
  const baseScore = MOCK_SCORES[specialty] ?? MOCK_SCORES.surgery
  const participationBonus = Math.min(count * 2, 20)
  const score = Math.min(baseScore + participationBonus, 94)

  const result = buildResult(score, count, specialty)
  await new Promise((r) => setTimeout(r, 1200))
  return Response.json(result)
}

/** Format the conversation into a transcript the evaluator model can score. */
function buildTranscript(messages: ChatMessage[], specialty: string): string {
  const lines = messages
    .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
    .map((m) => `${m.role === 'user' ? 'STUDENT (acting as doctor)' : 'PATIENT / SIMULATION'}: ${m.content.trim()}`)

  return [
    `Specialty: ${specialty}`,
    '',
    'Here is the full simulation transcript to evaluate:',
    '',
    lines.join('\n\n'),
    '',
    'Score the student now. Respond with ONLY the JSON object described in your instructions.',
  ].join('\n')
}

/** Extract and validate the JSON score object from Claude's reply. */
function parseScore(raw: string): ScoreResult | null {
  if (!raw) return null

  let text = raw.trim()
  // Strip a ```json ... ``` fence if the model wrapped the JSON in one.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) text = fenced[1].trim()

  // Grab the outermost { ... } in case of any stray prose.
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) return null

  try {
    const obj = JSON.parse(text.slice(start, end + 1))
    if (typeof obj?.score !== 'number' || !obj?.criteria) return null
    return obj as ScoreResult
  } catch {
    return null
  }
}

function buildResult(score: number, messageCount: number, specialty: string): ScoreResult {
  const careerFit =
    score >= 80 ? 'Excellent Fit' :
    score >= 65 ? 'Strong Fit' :
    score >= 45 ? 'Moderate Fit' :
    'Explore Other Paths'

  const summaries: Record<string, string> = {
    surgery: `You assessed Khalid's abdominal presentation across ${messageCount} exchanges. Your history-taking showed ${score >= 65 ? 'solid' : 'developing'} instincts for surgical emergencies. The key diagnostic signs — McBurney's point, fever, and the onset pattern — ${score >= 65 ? 'were appropriately explored' : 'needed more thorough coverage'}.`,
    emergency: `You managed Amira's acute respiratory presentation over ${messageCount} messages. Emergency medicine rewards fast, targeted questioning — your approach was ${score >= 65 ? 'appropriately focused' : 'a bit scattered under pressure'}. With more practice, pattern recognition sharpens quickly.`,
    general: `You took David's history across ${messageCount} exchanges. General practice rewards thoroughness and a systematic approach — you showed ${score >= 65 ? 'good breadth' : 'some gaps in the social and systemic history'} that would guide the diagnostic workup.`,
    'surgeon-day': `You worked through a full surgical day across ${messageCount} exchanges — ward round, theatre checklist, the operation itself, and a difficult conversation with the family. You showed ${score >= 65 ? 'strong' : 'developing'} judgement under the kind of pressure surgeons face every day.`,
  }

  const allStrengths = [
    'Asked about the onset and timing of symptoms',
    'Checked for associated symptoms early in the consultation',
    'Maintained a professional and empathetic tone',
    'Identified the severity of the situation appropriately',
    'Asked about past medical history',
    'Explored medication history and allergies',
    'Followed up on the patient\'s concerns',
  ]

  const allImprovements = [
    'Could have asked about radiation of pain earlier',
    'Social history (occupation, lifestyle) was not fully explored',
    'Allergy check was missed or came late',
    'More specific questions about symptom character would help',
    'Differential diagnosis thinking could be made more explicit',
    'Review of systems was incomplete',
  ]

  const strengthCount = score >= 70 ? 3 : score >= 50 ? 2 : 1
  const improvCount = score >= 70 ? 2 : 3

  return {
    score,
    careerFit,
    summary: summaries[specialty] ?? summaries.surgery,
    strengths: allStrengths.slice(0, strengthCount + 1),
    improvements: allImprovements.slice(0, improvCount + 1),
    criteria: {
      historyTaking: {
        score: Math.round(score * 0.22),
        comment: score >= 65 ? 'Good coverage of presenting complaint and context.' : 'Key history items were missed or asked too late.',
      },
      clinicalReasoning: {
        score: Math.round(score * 0.20),
        comment: score >= 65 ? 'Logical progression toward the likely diagnosis.' : 'Reasoning could be more structured and systematic.',
      },
      communication: {
        score: Math.round(score * 0.21),
        comment: 'Tone was appropriate and the patient felt heard.',
      },
      urgencyRecognition: {
        score: Math.round(score * 0.19),
        comment: score >= 65 ? 'Recognised the need for timely assessment.' : 'Urgency of the presentation was underweighted.',
      },
      completeness: {
        score: Math.round(score * 0.18),
        comment: score >= 65 ? 'Most essential ground was covered.' : 'Some important areas were left unexplored.',
      },
    },
  }
}
