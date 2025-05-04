<script lang="ts">
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'

  let Quill
  let editorDiv
  export let value = ''
  let editor

  onMount(async () => {
    if (!browser) return

    const quillModule = await import('quill')
    Quill = quillModule.default

    editor = new Quill(editorDiv, {
      theme: 'snow'
    })

    editor.root.innerHTML = value

    editor.on('text-change', () => {
      value = editor.root.innerHTML
    })
  })
</script>

<div bind:this={editorDiv}></div>
