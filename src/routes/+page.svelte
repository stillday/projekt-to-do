<script lang="ts">
	import { supabase } from '$lib/supabaseClient'
	let email = ''

	async function login() {
		const { error } = await supabase.auth.signInWithOtp({ email })
		if (error) {
			alert('Fehler: ' + error.message)
		} else {
			alert('Check deine Mail für den Login-Link')
		}
	}
</script>

<input
	type="email"
	bind:value={email}
	placeholder="Deine E-Mail"
	class="border px-4 py-2 rounded"
/>

<button on:click={login} class="bg-blue-600 text-white px-4 py-2 rounded mt-2">
	Login via Magic Link
</button>
