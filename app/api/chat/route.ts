import { MOCK_RESPONSES } from '@/lib/mockResponses'

export async function POST(request: Request) {
  const { messages, specialty } = await request.json()

  const userMessages = messages.filter((m: { role: string }) => m.role === 'user')
  const count = userMessages.length
  const lastUserMessage: string = userMessages[userMessages.length - 1]?.content?.toLowerCase() ?? ''

  const responses = MOCK_RESPONSES[specialty] ?? MOCK_RESPONSES.surgery
  const reply = pickResponse(responses, lastUserMessage, count)

  // Simulate a slight delay so it feels real
  await new Promise(r => setTimeout(r, 600 + Math.random() * 600))

  return Response.json({ reply })
}

function pickResponse(
  responses: { keywords: string[]; reply: string }[],
  userMessage: string,
  turnCount: number
): string {
  // Try keyword match first
  for (const r of responses) {
    if (r.keywords.some(k => userMessage.includes(k))) {
      return r.reply
    }
  }

  // Fallback by turn number
  const fallbacks = responses.filter(r => r.keywords.includes('__fallback__'))
  if (fallbacks.length > 0) {
    return fallbacks[turnCount % fallbacks.length].reply
  }

  return "I'm not sure I understand. Can you explain what you mean?"
}
