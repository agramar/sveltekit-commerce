<script lang="ts">
  import { page } from '$app/stores';
  import GridTile from '$lib/components/GridTile.svelte';

  /** @type {import('./$types').PageData} */
  export let data: any;
  let collection: any;

  $: data.body.collections.forEach((d: any) => {
    if (d.node.handle === $page?.params?.collection) {
      collection = d.node;
    }
  });
</script>

<svelte:head>
  <title>{collection?.handle} collection</title>
</svelte:head>

<div>
  {#if collection}
    <ul class="grid grid-flow-row gap-4 sm:grid-cols-2 md:grid-cols-3">
      {#each collection.products.edges as product, i (i)}
        <li>
          <div class="group relative block aspect-square overflow-hidden bg-dark">
            <GridTile
              href={`/product/${product?.node?.handle}`}
              title={product?.node?.title}
              price={product?.node?.priceRange?.maxVariantPrice?.amount}
              currencyCode={product?.node?.priceRange?.maxVariantPrice?.currencyCode}
              imageSrc={product?.node?.images?.edges[0].node?.originalSrc}
            />
          </div>
        </li>
      {/each}
    </ul>
  {:else}
    <div>There are no products in this collection.</div>
  {/if}
</div>
