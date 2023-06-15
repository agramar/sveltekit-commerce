import { getAllCollections } from '$lib/utils/shopify';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function load() {
  const res = await getAllCollections();
  if (res.status === 200) {
    const products = res.body?.data?.collections?.edges;

    if (products) {
      return { products };
    }
    throw error(404);
  } else {
    throw error(res.status);
  }
}
