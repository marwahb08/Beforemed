import { MOCK_RESPONSES, MOCK_OPTIONS } from '@/lib/mockResponses'
import { SYSTEM_PROMPTS } from '@/lib/systemPrompts'
import {
  claudeEnabled,
  getAnthropic,
  toAnthropicMessages,
  extractText,
  parseChatResponse,
  CHAT_FORMAT_INSTRUCTION,
  CHAT_MODEL,
} from '@/lib/anthropic'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(request: Request) {
  const { messages, specialty } = await request.json()
  const turn = countUserMessages(messages)

  // --- Real Claude path -----------------------------------------------------
  if (claudeEnabled()) {
    try {
      const system =
        (SYSTEM_PROMPTS[specialty] ?? SYSTEM_PROMPTS.surgery) + CHAT_FORMAT_INSTRUCTION
      const completion = await getAnthropic().messages.create({
        model: CHAT_MODEL,
        max_tokens: 1024,
        system,
        messages: toAnthropicMessages(messages),
      })
      const parsed = parseChatResponse(extractText(completion))
      const reply =
        parsed.reply ||
        "Sorry, I didn't quite catch that. Could you say it another way?"
      // If Claude didn't supply options (or returned plain text), fall back to
      // the scripted choices so the UI always has actions to show.
      const options = parsed.options.length > 0 ? parsed.options : mockOptions(specialty, turn)
      return Response.json({ reply, options })
    } catch (err) {
      // Never break the conversation — log and fall back to the mock below.
      console.error('[chat] Claude API error, falling back to mock:', err)
    }
  }

  // --- Mock path (no key configured, or the API call failed) ----------------
  const reply = mockReply(messages, specialty)
  const options = mockOptions(specialty, turn)
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 600))
  return Response.json({ reply, options })
}

function countUserMessages(messages: ChatMessage[]): number {
  return messages.filter((m: ChatMessage) => m.role === 'user').length
}

function mockReply(messages: ChatMessage[], specialty: string): string {
  const userMessages = messages.filter((m: ChatMessage) => m.role === 'user')
  const count = userMessages.length
  const lastUserMessage: string =
    userMessages[userMessages.length - 1]?.content?.toLowerCase() ?? ''

  const responses = MOCK_RESPONSES[specialty] ?? MOCK_RESPONSES.surgery
  return pickResponse(responses, lastUserMessage, count)
}

function mockOptions(specialty: string, turn: number): string[] {
  const pools = MOCK_OPTIONS[specialty] ?? MOCK_OPTIONS.surgery
  // Rotate through the option sets so the choices evolve as the chat goes on.
  // Offset by `turn` (not turn-1) so the first post-reply set doesn't repeat
  // the opening starter choices the student just picked from.
  return pools[turn % pools.length]
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
