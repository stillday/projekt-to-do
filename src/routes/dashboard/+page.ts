import { supabase } from '$lib/supabaseClient'
import { error } from '@sveltejs/kit'

export async function load({ depends }) {
  depends('app:projects')

  const [active, done] = await Promise.all([
    supabase.from('projects')
      .select('*')
      .eq('done', false)
      .order('created_at', { ascending: false }),

    supabase.from('projects')
      .select('*')
      .eq('done', true)
      .order('created_at', { ascending: false })
  ])

  if (active.error || done.error) {
    throw error(500, active.error?.message || done.error?.message)
  }

  return {
    activeProjects: active.data ?? [],
    doneProjects: done.data ?? []
  }
}
