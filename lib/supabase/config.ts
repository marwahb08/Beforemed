/**
 * Whether real Supabase credentials are configured.
 *
 * The app is designed to run without Supabase (mock/dev mode): when the env
 * vars are missing or still the placeholders, auth is skipped and protected
 * pages render with demo data instead of crashing. This mirrors the same
 * graceful-degradation check used in `proxy.ts`.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url || !key) return false
  if (url === 'your_supabase_project_url' || key === 'your_supabase_anon_key') return false

  // The Supabase client throws on a non-URL value, so validate it here first.
  return /^https?:\/\//.test(url)
}
