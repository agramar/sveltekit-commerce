<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Icons from '$lib/components/Icons.svelte';

  let value = $page.url.searchParams.get('q');

  async function submit() {
    let query = new URLSearchParams();
    if (value) {
      query.set('q', value);
    }
    await goto(`/search${query ? `?${query}` : ''}`, { keepFocus: true });
  }
</script>

<form on:submit|preventDefault={submit} class="relative flex w-full items-center">
  <div class="absolute right-0 top-0 mr-2">
    <Icons strokeColor="#fff" type="search" />
  </div>
  <input
    id="searchInput"
    type="text"
    bind:value
    placeholder="Search for products..."
    autocomplete="off"
    class="w-full border border-white/30 bg-transparent p-2"
  />
</form>

<style>
  form {
    margin: 0px;
    padding: 0px;
    display: inline;
  }
  input::placeholder {
    color: rgb(85, 85, 85);
  }
</style>
