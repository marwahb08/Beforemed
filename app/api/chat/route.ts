import { MOCK_RESPONSES } from '@/lib/mockResponses'
import { SYSTEM_PROMPTS } from '@/lib/systemPrompts'
import {
  claudeEnabled,
  getAnthropic,
  toAnthropicMessages,
  extractText,
  CHAT_MODEL,
} from '@/lib/anthropic'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(request: Request) {
  const { messages, specialty } = await request.json()

  // --- Real Claude path -----------------------------------------------------
  if (claudeEnabled()) {
    try {
      const system = SYSTEM_PROMPTS[specialty] ?? SYSTEM_PROMPTS.surgery
      const completion = await getAnthropic().messages.create({
        model: CHAT_MODEL,
        max_tokens: 1024,
        system,
        messages: toAnthropicMessages(messages),
      })
      const reply =
        extractText(completion) ||
        "Sorry, I didn't quite catch that. Could you say it another way?"
      return Response.json({ reply })
    } catch (err) {
      // Never break the conversation — log and fall back to the mock below.
      console.error('[chat] Claude API error, falling back to mock:', err)
    }
  }

  // --- Mock path (no key configured, or the API call failed) ----------------
  const reply = mockReply(messages, specialty)
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 600))
  return Response.json({ reply })
}

function mockReply(messages: ChatMessage[], specialty: string): string {
  const userMessages = messages.filter((m: ChatMessage) => m.role === 'user')
  const count = userMessages.length
  const lastUserMessage: string =
    userMessages[userMessages.length - 1]?.content?.toLowerCase() ?? ''

  const responses = MOCK_RESPONSES[specialty] ?? MOCK_RESPONSES.surgery
  return pickResponse(responses, lastUserMessage, count)
}

function pickResponse(
  responses: { keywords: string[]; reply: string }[],
  userMessage: string,
  turnCount: number
): string {
  // Try keyword match first
  for (const r of responses) {
    if (r.keywords.some((k) => userMessage.includes(k))) {
      return r.reply
    }
  }

  // Fallback by turn number
  const fallbacks = responses.filter((r) => r.keywords.includes('__fallback__'))
  if (fallbacks.length > 0) {
    return fallbacks[turnCount % fallbacks.length].reply
  }

  return "I'm not sure I understand. Can you explain what you mean?"
}
