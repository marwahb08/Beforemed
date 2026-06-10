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
