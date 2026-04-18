import type { CartItem, CartResponse, CartSuggestion, Product } from "~/types";

const CART_KEY = "bytedigital_cart";

function _recalc(items: CartItem[], total: Ref<number>, count: Ref<number>) {
  total.value = items.reduce((sum, item) => {
    // Only count available items
    if (item.stock_status === "out_of_stock" || item.stock_status === "inactive") {
      return sum;
    }
    const price = item.unit_price || item.product.sale_price || item.product.base_price;
    const qty = item.stock_status === "limited" && item.available_stock
      ? Math.min(item.quantity, item.available_stock)
      : item.quantity;
    return sum + price * qty;
  }, 0);
  count.value = items.reduce((sum, item) => sum + item.quantity, 0);
}

export function useCart() {
  const items = useState<CartItem[]>("cart_items", () => []);
  const cartTotal = useState<number>("cart_total", () => 0);
  const cartCount = useState<number>("cart_count", () => 0);
  const initialized = useState<boolean>("cart_init", () => false);

  // New stock-related state
  const hasUnavailableItems = useState<boolean>("cart_has_unavailable", () => false);
  const unavailableCount = useState<number>("cart_unavailable_count", () => 0);
  const suggestions = useState<CartSuggestion[]>("cart_suggestions", () => []);

  const { api } = useApi();
  const { isAuthenticated } = useAuth();

  function setCartData(cart: CartResponse) {
    items.value = cart.items;
    cartTotal.value = cart.total;
    hasUnavailableItems.value = cart.has_unavailable_items;
    unavailableCount.value = cart.unavailable_count;
    suggestions.value = cart.suggestions;
    cartCount.value = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

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
      const cart = await api<CartResponse>("/account/cart/");
      setCartData(cart);
    } catch {
      setItems([]);
    }
  }

  // ── Public API ───────────────────────────────────────────────
  async function addToCart(product: Product, quantity = 1): Promise<boolean> {
    if (isAuthenticated.value) {
      try {
        const cart = await api<CartResponse>("/account/cart/items", {
          method: "POST",
          body: { product_id: product.id, quantity },
        });
        setCartData(cart);
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

  async function _findServerItemId(productId: number): Promise<number | null> {
    // Si el item local no tiene id (p.ej. residuo de localStorage tras login),
    // re-sincroniza con el server para recuperar los ids reales.
    let item = items.value.find((i) => i.product.id === productId);
    if (item?.id) return item.id;
    await fetchServerCart();
    item = items.value.find((i) => i.product.id === productId);
    return item?.id ?? null;
  }

  async function removeFromCart(productId: number): Promise<boolean> {
    if (isAuthenticated.value) {
      const itemId = await _findServerItemId(productId);
      if (itemId == null) {
        // No existe en el server — tratamos como éxito y limpiamos localmente.
        items.value = items.value.filter((i) => i.product.id !== productId);
        _recalc(items.value, cartTotal, cartCount);
        return true;
      }
      try {
        const cart = await api<CartResponse>(`/account/cart/items/${itemId}`, {
          method: "DELETE",
        });
        setCartData(cart);
        return true;
      } catch {
        return false;
      }
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
      const itemId = await _findServerItemId(productId);
      if (itemId == null) return false;
      try {
        const cart = await api<CartResponse>(`/account/cart/items/${itemId}`, {
          method: "PUT",
          body: { quantity },
        });
        setCartData(cart);
        return true;
      } catch {
        return false;
      }
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
        const cart = await api<CartResponse>("/account/cart/merge", {
          method: "POST",
          body: mergePayload,
        });
        setCartData(cart);
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
    // Stock status
    hasUnavailableItems,
    unavailableCount,
    suggestions,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    mergeCart,
    fetchServerCart,
  };
}
