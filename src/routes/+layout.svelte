<script lang="ts">
	import '../app.css';
	import { session } from '$lib/stores/session'
	import { goto } from '$app/navigation'
	import { supabase } from '$lib/supabaseClient'
	import { onMount } from 'svelte';

	onMount(async () => {
		const {
				data: { session: newSession }
			} = await supabase.auth.getSession()

			if (newSession) {
				session.set(newSession)
				goto('/dashboard')
			}
	})
	$: loggedIn = $session !== null
  </script>
  
  <header class="p-4 bg-white shadow mb-6">
	<div class="container mx-auto flex justify-between items-center">
	  <h1 class="text-xl font-bold">📝 ToDo Projekt</h1>
  
	  {#if loggedIn}
		<span class="text-sm text-green-700">
		  Eingeloggt als: {$session?.user.email}
		</span>
	  {:else}
		<button
		  class="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
		  on:click={() => goto('/')}
		>
		  Jetzt einloggen
		</button>
	  {/if}
	</div>
  </header>
  
  <main class="container mx-auto px-4">
	<slot />
  </main>
  