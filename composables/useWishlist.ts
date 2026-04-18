import type { WishlistItem, Product } from "~/types";

export function useWishlist() {
  const { api } = useApi();
  const { isAuthenticated } = useAuth();
  const { show: showToast } = useToast();

  const items = useState<WishlistItem[]>("wishlist_items", () => []);
  const loaded = useState("wishlist_loaded", () => false);

  async function fetchWishlist() {
    if (!isAuthenticated.value) {
      items.value = [];
      loaded.value = false;
      return;
    }
    try {
      items.value = await api<WishlistItem[]>("/account/wishlist/");
      loaded.value = true;
    } catch (err) {
      console.error("[wishlist] fetch failed", err);
      items.value = [];
    }
  }

  function isInWishlist(productId: number): boolean {
    return items.value.some((i) => i.product_id === productId);
  }

  async function toggleWishlist(productId: number) {
    if (!isAuthenticated.value) {
      navigateTo(`/login?redirect=${encodeURIComponent(useRoute().fullPath)}`);
      return;
    }

    if (!loaded.value) await fetchWishlist();

    const wasIn = isInWishlist(productId);
    const previous = items.value;

    if (wasIn) {
      items.value = items.value.filter((i) => i.product_id !== productId);
    } else {
      items.value = [
        ...items.value,
        { id: -1, product_id: productId, product: {} as Product },
      ];
    }

    try {
      await api(`/account/wishlist/${productId}`, { method: wasIn ? "DELETE" : "POST" });
      await fetchWishlist();
    } catch (err: any) {
      const status = err?.response?.status ?? err?.statusCode ?? err?.status;
      if (status === 409 || status === 404) {
        await fetchWishlist();
        return;
      }
      items.value = previous;
      console.error("[wishlist] toggle failed", err);
      showToast("No se pudo actualizar favoritos", "error");
    }
  }

  async function addToWishlist(productId: number) {
    if (!isInWishlist(productId)) await toggleWishlist(productId);
  }

  async function removeFromWishlist(productId: number) {
    if (isInWishlist(productId)) await toggleWishlist(productId);
  }

  if (isAuthenticated.value && !loaded.value) {
    fetchWishlist();
  }

  watch(isAuthenticated, (is) => {
    if (is) fetchWishlist();
    else {
      items.value = [];
      loaded.value = false;
    }
  });

  return { items, fetchWishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist };
}
