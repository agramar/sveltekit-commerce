<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ShoppingCart from '$lib/components/ShoppingCart.svelte';
  import { createCart } from '$lib/utils/shopify';
  import { onMount } from 'svelte';
  import '../app.css';
  import { getCartItems } from '../store';

  let cartId: string;
  let checkoutUrl: string;
  let cartCreatedAt: number;
  let cartItems: any[] = [];

  onMount(async () => {
    if (typeof window !== 'undefined') {
      cartId = JSON.parse(localStorage.getItem('cartId') || '');
      cartCreatedAt = JSON.parse(localStorage.getItem('cartCreatedAt') || '');
      checkoutUrl = JSON.parse(localStorage.getItem('cartUrl') || '');

      let currentDate = Date.now();
      let difference = currentDate - cartCreatedAt;
      let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
      let cartIdExpired = totalDays > 6;
      if (cartId === 'undefined' || cartId === 'null' || cartIdExpired) {
        await callCreateCart();
      }

      await loadCart();
      document.addEventListener('keydown', (e) => {
        let key = e.key;
        if (key === 'Escape') {
          showCart = false;
        }
      });
    }
  });

  async function callCreateCart() {
    const cartRes = await createCart();

    if (typeof window !== 'undefined') {
      const cartCreatedAt = Date.now().toString();
      const cartId = JSON.stringify(cartRes.body?.data?.cartCreate?.cart?.id);
      const cartUrl = JSON.stringify(cartRes.body?.data?.cartCreate?.cart?.checkoutUrl);
      localStorage.setItem('cartCreatedAt', cartCreatedAt);
      localStorage.setItem('cartId', cartId);
      localStorage.setItem('cartUrl', cartUrl);
    }
  }

  async function loadCart() {
    const res = await getCartItems();
    cartItems = res?.body?.data?.cart?.lines?.edges;
  }

  let showCart = false;
  let loading = false;

  async function openCart() {
    await loadCart();
    showCart = true;
  }

  function hideCart() {
    showCart = false;
  }

  function getCheckoutUrl() {
    window.open(checkoutUrl, '_blank');
    loading = false;
  }

  async function addToCart(event: any) {
    await fetch('/cart.json', {
      method: 'PATCH',
      body: JSON.stringify({ cartId: cartId, variantId: event.detail.body }),
    });

    await loadCart();
    loading = false;
  }

  async function removeProduct(event: any) {
    if (typeof window !== 'undefined') {
      cartId = JSON.parse(localStorage.getItem('cartId') || '');
    }
    await fetch('/cart.json', {
      method: 'PUT',
      body: JSON.stringify({
        cartId,
        lineId: event.detail.body.lineId,
        quantity: event.detail.body.quantity,
        variantId: event.detail.body.variantId,
      }),
    });
    await loadCart();
    loading = false;
  }
</script>

<main class={`${showCart ? 'h-screen' : 'min-h-screen'} overflow-hidden text-white`}>
  {#if showCart}
    <ShoppingCart
      items={cartItems}
      on:click={hideCart}
      on:removeProduct={removeProduct}
      on:addProduct={addToCart}
      on:getCheckoutUrl={getCheckoutUrl}
      bind:loading
    />
  {/if}
  <Header on:openCart={openCart} />
  <div class="min-h-screen overflow-scroll">
    <slot />
    <Footer />
  </div>
</main>
