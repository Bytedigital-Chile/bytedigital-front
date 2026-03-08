import type { Product } from "~/types";

const STORAGE_KEY = "bytedigital_recently_viewed";
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const products = useState<Product[]>("recently_viewed", () => []);

  function load() {
    if (import.meta.server) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) products.value = JSON.parse(raw);
    } catch {
      products.value = [];
    }
  }

  function addProduct(product: Product) {
    products.value = [
      product,
      ...products.value.filter((p) => p.id !== product.id),
    ].slice(0, MAX_ITEMS);
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value));
    }
  }

  if (import.meta.client) {
    load();
  }

  return { products, addProduct };
}
