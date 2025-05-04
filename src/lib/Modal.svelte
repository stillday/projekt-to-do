<!-- src/lib/Modal.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
  </script>
  
  <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
    <div
      class="bg-white rounded shadow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
    >
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        on:click={() => dispatch('close')}
        aria-label="Schließen"
      >
        ✕
      </button>
      <slot />
    </div>
  </div>
  