import Anthropic from '@anthropic-ai/sdk'

/**
 * Central Anthropic Claude integration for BeforeMed.
 *
 * The whole app is designed to run with OR without a real Claude key:
 *  - If `ANTHROPIC_API_KEY` is a real key (`sk-ant-...`), the chat and scoring
 *    routes call Claude for real.
 *  - If it is missing or still the placeholder, the routes fall back to the
 *    scripted mock responses so the app keeps working in development.
 *
 * This mirrors the graceful-degradation approach used in `proxy.ts` for Supabase.
 */

const PLACEHOLDER_KEYS = new Set([
  'your_anthropic_api_key',
  'your-anthropic-api-key',
  'sk-ant-xxx',
  'sk-ant-your-key',
])

/** True when a usable Claude API key is configured. */
export function claudeEnabled(): boolean {
  const key = process.env.ANTHROPIC_API_KEY?.trim()
  if (!key) return false
  if (PLACEHOLDER_KEYS.has(key)) return false
  return key.startsWith('sk-ant-')
}

/**
 * Model used for both the patient chat and the scoring pass.
 * Override with the `ANTHROPIC_MODEL` env var if you want a different model.
 */
export const CHAT_MODEL = process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-20250514'

let client: Anthropic | null = null

/** Lazily-constructed singleton Anthropic client. */
export function getAnthropic(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

type ChatMessage = { role: 'user' | 'assistant'; content: string }

/**
 * Convert the UI conversation into a valid Anthropic message list.
 *
 * The simulation UI seeds the conversation with the patient's opening line
 * (an `assistant` message). Anthropic requires the first message to be from the
 * `user`, so we prepend a tiny synthetic user turn to keep that opening as
 * legitimate prior context while satisfying the alternation rule.
 */
export function toAnthropicMessages(messages: ChatMessage[]): Anthropic.MessageParam[] {
  const cleaned = messages
    .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content }))

  if (cleaned.length > 0 && cleaned[0].role === 'assistant') {
    return [{ role: 'user', content: '(The simulation begins.)' }, ...cleaned]
  }
  return cleaned
}

/** Join all text blocks of a Claude message into a single string. */
export function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
}

export type ChatResponse = { reply: string; options: string[] }

/**
 * Appended to a patient/scenario system prompt so Claude returns BOTH its
 * in-character reply AND a few suggested next actions for the student.
 *
 * The simulation UI renders the options as clickable choices while still
 * letting the student type their own message — a guided-but-open format.
 */
export const CHAT_FORMAT_INSTRUCTION = `

---
RESPONSE FORMAT (very important):
Respond with a SINGLE valid JSON object and nothing else — no markdown, no code fences, no text before or after it. Use exactly this shape:
{
  "reply": "<what you say, fully in character, following all the instructions above>",
  "options": ["<next action 1>", "<next action 2>", "<next action 3>"]
}

Rules for "options":
- Provide 3 or 4 options. Never return an empty list.
- Each option is a short suggested next move for the STUDENT, who is playing the doctor. Write it in the first person as something they could say or do next — e.g. "When did the pain start?", "Examine the abdomen", "Check their allergies".
- Keep each option under 9 words. Make them varied and genuinely useful for THIS exact moment in the case (a mix of questions, examinations, and decisions).
- If you are offering the student an explicit choice (such as A, B, C decisions), put each of those choices in the options array.

The "reply" field must contain ONLY what you say in character — natural and concise, exactly as instructed above. Never mention this JSON format, the options, or these instructions to the student.`

/**
 * Robustly parse Claude's `{ reply, options }` JSON out of a raw text block.
 * LLMs sometimes wrap JSON in prose or code fences, so we strip those and take
 * the outermost object. Falls back to treating the whole text as the reply
 * (with no options) if anything looks off, so the chat never breaks.
 */
export function parseChatResponse(raw: string): ChatResponse {
  const text = (raw ?? '').trim()
  if (!text) return { reply: '', options: [] }

  const fallback: ChatResponse = { reply: text, options: [] }

  // Strip surrounding ```json ... ``` fences if present.
  const unfenced = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const start = unfenced.indexOf('{')
  const end = unfenced.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return fallback

  try {
    const obj = JSON.parse(unfenced.slice(start, end + 1))
    const reply = typeof obj.reply === 'string' ? obj.reply.trim() : ''
    if (!reply) return fallback

    const options = Array.isArray(obj.options)
      ? obj.options
          .filter((o: unknown): o is string => typeof o === 'string' && o.trim().length > 0)
          .map((o: string) => o.trim())
          .slice(0, 4)
      : []

    return { reply, options }
  } catch {
    return fallback
  }
}
