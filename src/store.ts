import { loadCart } from '$lib/utils/shopify';
import { writable } from 'svelte/store';

export const cartQuantity = writable('');
export const cart = writable([]);
export const search = writable('');

export const getCartItems = async () => {
  const cartId = JSON.parse(localStorage.getItem('cartId') || '');

  try {
    const shopifyResponse = await loadCart(cartId);

    let sum = 0;
    shopifyResponse.body?.data?.cart?.lines?.edges?.forEach((d) => {
      sum += d.node.quantity;
    });
    cartQuantity.set(sum);
    return shopifyResponse;
  } catch (error) {
    console.log(error);
  }
};
