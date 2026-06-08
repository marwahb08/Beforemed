import { MOCK_SCORES } from '@/lib/mockResponses'

export async function POST(request: Request) {
  const { messages, specialty } = await request.json()

  const userMessages = messages.filter((m: { role: string }) => m.role === 'user')
  const count = userMessages.length

  // Score scales with how many questions were asked, capped at a realistic ceiling
  const baseScore = MOCK_SCORES[specialty] ?? MOCK_SCORES.surgery
  const participationBonus = Math.min(count * 2, 20)
  const score = Math.min(baseScore + participationBonus, 94)

  const result = buildResult(score, count, specialty)

  await new Promise(r => setTimeout(r, 1200))

  return Response.json(result)
}

function buildResult(score: number, messageCount: number, specialty: string) {
  const careerFit =
    score >= 80 ? 'Excellent Fit' :
    score >= 65 ? 'Strong Fit' :
    score >= 45 ? 'Moderate Fit' :
    'Explore Other Paths'

  const summaries: Record<string, string> = {
    surgery: `You assessed Khalid's abdominal presentation across ${messageCount} exchanges. Your history-taking showed ${score >= 65 ? 'solid' : 'developing'} instincts for surgical emergencies. The key diagnostic signs — McBurney's point, fever, and the onset pattern — ${score >= 65 ? 'were appropriately explored' : 'needed more thorough coverage'}.`,
    emergency: `You managed Amira's acute respiratory presentation over ${messageCount} messages. Emergency medicine rewards fast, targeted questioning — your approach was ${score >= 65 ? 'appropriately focused' : 'a bit scattered under pressure'}. With more practice, pattern recognition sharpens quickly.`,
    general: `You took David's history across ${messageCount} exchanges. General practice rewards thoroughness and a systematic approach — you showed ${score >= 65 ? 'good breadth' : 'some gaps in the social and systemic history'} that would guide the diagnostic workup.`,
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
