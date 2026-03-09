import type { WishlistItem } from "~/types";

export function useWishlist() {
  const { api } = useApi();
  const { isAuthenticated } = useAuth();

  const items = useState<WishlistItem[]>("wishlist_items", () => []);
  const loaded = useState("wishlist_loaded", () => false);

  async function fetchWishlist() {
    if (!isAuthenticated.value) return;
    try {
      items.value = await api<WishlistItem[]>("/account/wishlist/");
      loaded.value = true;
    } catch {
      items.value = [];
    }
  }

  async function addToWishlist(productId: number) {
    if (!isAuthenticated.value) {
      navigateTo(`/login?redirect=${encodeURIComponent(useRoute().fullPath)}`);
      return;
    }
    try {
      await api(`/account/wishlist/${productId}`, { method: "POST" });
      await fetchWishlist();
    } catch {
      // already in wishlist or error
    }
  }

  async function removeFromWishlist(productId: number) {
    try {
      await api(`/account/wishlist/${productId}`, { method: "DELETE" });
      items.value = items.value.filter((i) => i.product_id !== productId);
    } catch {
      // handle error
    }
  }

  function isInWishlist(productId: number): boolean {
    return items.value.some((i) => i.product_id === productId);
  }

  async function toggleWishlist(productId: number) {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }

  // Load on first use if authenticated
  if (isAuthenticated.value && !loaded.value) {
    fetchWishlist();
  }

  return { items, fetchWishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist };
}
