import type { CartItem, Product } from "~/types";

const CART_KEY = "bytedigital_cart";

function _recalc(items: CartItem[], total: Ref<number>, count: Ref<number>) {
  total.value = items.reduce((sum, item) => {
    const price = item.unit_price || item.product.sale_price || item.product.base_price;
    return sum + price * item.quantity;
  }, 0);
  count.value = items.reduce((sum, item) => sum + item.quantity, 0);
}

export function useCart() {
  const items = useState<CartItem[]>("cart_items", () => []);
  const cartTotal = useState<number>("cart_total", () => 0);
  const cartCount = useState<number>("cart_count", () => 0);
  const initialized = useState<boolean>("cart_init", () => false);

  const { api } = useApi();
  const { isAuthenticated } = useAuth();

  function setItems(newItems: CartItem[]) {
    items.value = newItems;
    _recalc(newItems, cartTotal, cartCount);
  }

  // ── localStorage helpers ─────────────────────────────────────
  function loadFromStorage() {
    if (import.meta.server) return;
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }

  function saveToStorage() {
    if (import.meta.server) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items.value));
  }

  function clearStorage() {
    if (import.meta.server) return;
    localStorage.removeItem(CART_KEY);
  }

  // ── Server helpers ───────────────────────────────────────────
  async function fetchServerCart() {
    try {
      const cart = await api<{ items: CartItem[]; total: number }>("/account/cart/");
      setItems(cart.items);
    } catch {
      setItems([]);
    }
  }

  // ── Public API ───────────────────────────────────────────────
  async function addToCart(product: Product, quantity = 1): Promise<boolean> {
    if (isAuthenticated.value) {
      try {
        const cart = await api<{ items: CartItem[]; total: number }>("/account/cart/items", {
          method: "POST",
          body: { product_id: product.id, quantity },
        });
        setItems(cart.items);
        return true;
      } catch {
        return false;
      }
    } else {
      const existing = items.value.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
        _recalc(items.value, cartTotal, cartCount);
      } else {
        setItems([...items.value, { product, quantity }]);
      }
      saveToStorage();
      return true;
    }
  }

  async function removeFromCart(productId: number): Promise<boolean> {
    if (isAuthenticated.value) {
      const item = items.value.find((i) => i.product.id === productId);
      if (item?.id) {
        try {
          const cart = await api<{ items: CartItem[]; total: number }>(`/account/cart/items/${item.id}`, {
            method: "DELETE",
          });
          setItems(cart.items);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    } else {
      setItems(items.value.filter((i) => i.product.id !== productId));
      saveToStorage();
      return true;
    }
  }

  async function updateQuantity(productId: number, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated.value) {
      const item = items.value.find((i) => i.product.id === productId);
      if (item?.id) {
        try {
          const cart = await api<{ items: CartItem[]; total: number }>(`/account/cart/items/${item.id}`, {
            method: "PUT",
            body: { quantity },
          });
          setItems(cart.items);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    } else {
      const item = items.value.find((i) => i.product.id === productId);
      if (item) {
        item.quantity = quantity;
        _recalc(items.value, cartTotal, cartCount);
        saveToStorage();
      }
      return true;
    }
  }

  async function clearCart() {
    if (isAuthenticated.value) {
      try {
        await api("/account/cart/", { method: "DELETE" });
        setItems([]);
      } catch {
        // handle error
      }
    } else {
      setItems([]);
      saveToStorage();
    }
  }

  async function mergeCart() {
    if (!isAuthenticated.value) return;
    if (import.meta.server) return;

    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      await fetchServerCart();
      return;
    }

    let localItems: CartItem[] = [];
    try {
      localItems = JSON.parse(raw);
    } catch {
      clearStorage();
      await fetchServerCart();
      return;
    }

    if (localItems.length > 0) {
      const mergePayload = localItems.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
      }));
      try {
        const cart = await api<{ items: CartItem[]; total: number }>("/account/cart/merge", {
          method: "POST",
          body: mergePayload,
        });
        setItems(cart.items);
      } catch {
        await fetchServerCart();
      }
    } else {
      await fetchServerCart();
    }

    clearStorage();
  }

  // ── Initial load (once per app lifecycle) ────────────────────
  if (import.meta.client && !initialized.value) {
    initialized.value = true;
    if (isAuthenticated.value) {
      mergeCart();
    } else {
      loadFromStorage();
    }
  }

  return {
    items,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    mergeCart,
  };
}
