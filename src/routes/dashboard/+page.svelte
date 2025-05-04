<script lang="ts">
  import { supabase } from '$lib/supabaseClient'
  import { invalidate } from '$app/navigation'
  import { session } from '$lib/stores/session'
  import QuillEditor from '$lib/QuillEditor.svelte'
  import { browser } from '$app/environment'
  import Modal from '$lib/Modal.svelte'
  import { Pencil, Trash } from 'lucide-svelte'

  export let data

  let newTitle = ''
  let newDescription = ''
  let loading = false
  let showDone = false
  let selectedProject = null
  let editTitle = ''
  let editDescription = ''
  let showModal = false
  let showDetails = false
  let showConfirmDelete = false

  async function addProject() {
    loading = true
    const { error } = await supabase.from('projects').insert({
      title: newTitle,
      description: newDescription,
      user_id: $session?.user.id
    })
    if (!error) {
      newTitle = ''
      newDescription = ''
      await invalidate('app:projects')
    } else {
      alert('Fehler: ' + error.message)
    }
    loading = false
  }

  async function markAsDone(id: string) {
    const { error } = await supabase
      .from('projects')
      .update({ done: true })
      .eq('id', id)
    if (!error) {
      await invalidate('app:projects')
    } else {
      alert('Konnte Projekt nicht aktualisieren: ' + error.message)
    }
  }

  function openEditor(project) {
    showDetails = false
    setTimeout(() => {
      selectedProject = project
      editTitle = project.title
      editDescription = project.description
      showModal = true
    }, 150)
  }

  function openDetails(project) {
    selectedProject = project
    showDetails = true
  }

  async function updateProject() {
    const { error } = await supabase
      .from('projects')
      .update({ title: editTitle, description: editDescription })
      .eq('id', selectedProject.id)
    if (!error) {
      showModal = false
      showDetails = false
      await invalidate('app:projects')
    } else {
      alert('Fehler beim Speichern: ' + error.message)
    }
  }

  async function deleteProject() {
    const { error } = await supabase.from('projects').delete().eq('id', selectedProject.id)
    if (!error) {
      showConfirmDelete = false
      showModal = false
      showDetails = false
      await invalidate('app:projects')
    } else {
      alert('Fehler beim Löschen: ' + error.message)
    }
  }
</script>

<section class="max-w-2xl mx-auto px-4">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold">Deine Projekte</h2>
    <button
      class="text-sm underline text-blue-600"
      on:click={() => (showDone = !showDone)}
    >
      {showDone ? 'Nur aktive anzeigen' : 'Abgeschlossene anzeigen'}
    </button>
  </div>

  {#if showDone}
    <h3 class="text-lg font-semibold mb-2 text-gray-700">✅ Abgeschlossene Projekte</h3>
    {#if data.doneProjects.length > 0}
      <ul class="space-y-4">
        {#each data.doneProjects as project}
          <li class="bg-gray-50 border px-4 py-2 rounded text-gray-500 italic">
            {project.title}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-sm text-gray-500">Keine erledigten Projekte.</p>
    {/if}
  {:else}
    <h3 class="text-lg font-semibold mb-2 text-gray-700">🛠️ Aktive Projekte</h3>
    {#if data.activeProjects.length > 0}
      <ul class="space-y-4">
        {#each data.activeProjects as project}
          <li class="bg-white shadow-md rounded p-4 border cursor-pointer" on:click={() => openDetails(project)}>
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg">{project.title}</h3>
                {#if project.description}
                  <div class="text-sm text-gray-600 mt-1 line-clamp-2">
                    {@html project.description}
                  </div>
                {/if}
              </div>
              <div class="flex gap-3 items-start" on:click|stopPropagation>
                <button
                  on:click={() => openEditor(project)}
                  class="hover:text-blue-600"
                  title="Bearbeiten"
                >
                  <Pencil size={20} />
                </button>
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={project.done}
                    on:change={() => markAsDone(project.id)}
                    class="accent-green-600"
                  />
                  <span class="text-sm">Fertig</span>
                </label>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-sm text-gray-500">Noch keine aktiven Projekte.</p>
    {/if}
  {/if}

  <div class="mt-10 border-t pt-6">
    <h3 class="text-xl font-semibold mb-2">Neues Projekt anlegen</h3>
    <input
      type="text"
      placeholder="Titel"
      bind:value={newTitle}
      class="w-full border px-3 py-2 rounded mb-3"
    />
    {#if browser}
      <QuillEditor bind:value={newDescription} on:input={() => {}} />
    {/if}
    <button
      on:click={() => { addProject(); newDescription = '' }}
      class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mt-3"
      disabled={loading || newTitle.trim() === ''}
    >
      {loading ? 'Speichern...' : '+ Projekt anlegen'}
    </button>
  </div>
</section>

{#if showModal && browser}
  <Modal on:close={() => (showModal = false)} class="max-w-2xl max-h-[90vh] overflow-auto">
    <h2 class="text-lg font-semibold mb-2">Projekt bearbeiten</h2>
    <input
      type="text"
      bind:value={editTitle}
      class="w-full border px-3 py-2 rounded mb-3"
    />
    <QuillEditor bind:value={editDescription} />
    <div class="mt-4 flex justify-between items-center">
      <button
        class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        on:click={() => showConfirmDelete = true}
        aria-label="Projekt löschen"
      >
        <Trash size={16} class="inline mr-1" /> Löschen
      </button>
      <div class="flex gap-2">
        <button
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          on:click={() => (showModal = false)}
        >
          Abbrechen
        </button>
        <button
          class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          on:click={updateProject}
        >
          Speichern
        </button>
      </div>
    </div>
  </Modal>
{/if}

{#if showConfirmDelete && browser}
  <Modal on:close={() => (showConfirmDelete = false)} class="max-w-md">
    <h2 class="text-lg font-semibold mb-4">Projekt wirklich löschen?</h2>
    <div class="flex justify-end gap-2">
      <button
        class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        on:click={() => (showConfirmDelete = false)}
      >
        Abbrechen
      </button>
      <button
        class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        on:click={deleteProject}
      >
        Löschen
      </button>
    </div>
  </Modal>
{/if}

{#if showDetails && selectedProject}
  <Modal on:close={() => (showDetails = false)} class="max-w-2xl max-h-[90vh] overflow-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">{selectedProject.title}</h2>
      <button on:click={() => openEditor(selectedProject)} class="hover:text-blue-600" aria-label="Bearbeiten">
        <Pencil size={20} />
      </button>
    </div>
    <div class="prose max-w-none">
      {@html selectedProject.description}
    </div>
  </Modal>
{/if}
