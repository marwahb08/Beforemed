import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  // Mock/dev mode: Supabase isn't configured yet, so skip auth and render the
  // dashboard with a demo user. This keeps the whole app viewable without keys.
  if (!isSupabaseConfigured()) {
    const demoUser = { id: 'demo-user', email: 'demo@beforemed.app' } as User
    return <DashboardClient user={demoUser} />
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <DashboardClient user={user} />
}
