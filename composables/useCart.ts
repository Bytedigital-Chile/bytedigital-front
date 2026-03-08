import type { CartItem, Product } from "~/types";

const CART_KEY = "bytedigital_cart";

export function useCart() {
  const items = useState<CartItem[]>("cart_items", () => []);

  function loadFromStorage() {
    if (import.meta.server) return;
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) items.value = JSON.parse(raw);
    } catch {
      items.value = [];
    }
  }

  function saveToStorage() {
    if (import.meta.server) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items.value));
  }

  function addToCart(product: Product, quantity = 1) {
    const existing = items.value.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({ product, quantity });
    }
    saveToStorage();
  }

  function removeFromCart(productId: number) {
    items.value = items.value.filter((i) => i.product.id !== productId);
    saveToStorage();
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find((i) => i.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
        saveToStorage();
      }
    }
  }

  function clearCart() {
    items.value = [];
    saveToStorage();
  }

  const cartTotal = computed(() =>
    items.value.reduce((sum, item) => {
      const price = item.product.sale_price ?? item.product.base_price;
      return sum + price * item.quantity;
    }, 0),
  );

  const cartCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  // Load on mount
  if (import.meta.client) {
    loadFromStorage();
  }

  return { items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount };
}
