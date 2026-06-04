import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, computed } from "vue";
import { useAuth } from "~/composables/useAuth";

const CART_KEY = "bytedigital_cart";

const emptyCart = {
  items: [],
  total: 0,
  has_unavailable_items: false,
  unavailable_count: 0,
  suggestions: [],
};

describe("useAuth — cart sync on login", () => {
  let apiCalls: { url: string; opts?: any }[];

  beforeEach(() => {
    apiCalls = [];
    const api = vi.fn(async (url: string, opts?: any) => {
      apiCalls.push({ url, opts });
      if (url === "/customer-auth/login") return { access_token: "tok" };
      if (url === "/customer-auth/google") return { access_token: "tok" };
      if (url === "/customer-auth/me") {
        return { id: 1, email: "a@b.cl", first_name: "A", last_name: "B" };
      }
      return emptyCart; // cart endpoints (/account/cart/, /account/cart/merge)
    });
    (globalThis as any).useApi = () => ({ api });
    // useCart() reads its auth state from the auto-imported (global) useAuth.
    // Simulate a logged-in session so the server-cart path is exercised.
    (globalThis as any).useAuth = () => ({
      token: ref("tok"),
      user: ref({ id: 1 }),
      isAuthenticated: computed(() => true),
    });
  });

  it("merges the localStorage cart into the server cart after email/password login", async () => {
    // Anonymous user built a cart in localStorage before logging in
    localStorage.setItem(
      CART_KEY,
      JSON.stringify([{ product: { id: 7 }, quantity: 2 }]),
    );

    const { login } = useAuth();
    await login("a@b.cl", "pass");

    const merge = apiCalls.find((c) => c.url === "/account/cart/merge");
    expect(merge).toBeTruthy();
    expect(merge!.opts.body).toEqual([{ product_id: 7, quantity: 2 }]);
  });

  it("merges the localStorage cart into the server cart after Google login", async () => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify([{ product: { id: 9 }, quantity: 1 }]),
    );

    const { loginWithGoogle } = useAuth();
    await loginWithGoogle("google-credential");

    const merge = apiCalls.find((c) => c.url === "/account/cart/merge");
    expect(merge).toBeTruthy();
    expect(merge!.opts.body).toEqual([{ product_id: 9, quantity: 1 }]);
  });
});
