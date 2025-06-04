import type { Handle } from '@sveltejs/kit'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

console.log('PUBLIC_SUPABASE_URL:', process.env.PUBLIC_SUPABASE_URL);
console.log('PUBLIC_SUPABASE_ANON_KEY:', process.env.PUBLIC_SUPABASE_ANON_KEY);


export const handle: Handle = async ({ event, resolve }) => {
	const { data: { session } } = await supabase.auth.getSession()

	// Du kannst hier später session.user.id weiterreichen
	event.locals.session = session

	return resolve(event)
}
