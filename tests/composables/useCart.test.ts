import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "~/composables/useCart";
import type { Product } from "~/types";

// Factory helper to create a minimal valid Product
function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Test Product",
    slug: "test-product",
    sku: "TP-001",
    description: null,
    short_description: null,
    base_price: 100,
    sale_price: null,
    cost_price: null,
    stock: 10,
    is_active: true,
    is_featured: false,
    condition: "new",
    brand: null,
    images: [],
    ...overrides,
  };
}

describe("useCart", () => {
  it("adds a product to an empty cart", () => {
    const { items, addToCart } = useCart();
    const product = makeProduct();

    addToCart(product);

    expect(items.value).toHaveLength(1);
    expect(items.value[0].product.id).toBe(1);
    expect(items.value[0].quantity).toBe(1);
  });

  it("increments quantity when adding an existing product", () => {
    const { items, addToCart } = useCart();
    const product = makeProduct();

    addToCart(product, 2);
    addToCart(product, 3);

    expect(items.value).toHaveLength(1);
    expect(items.value[0].quantity).toBe(5);
  });

  it("adds multiple distinct products", () => {
    const { items, addToCart } = useCart();
    const productA = makeProduct({ id: 1, name: "A" });
    const productB = makeProduct({ id: 2, name: "B" });

    addToCart(productA);
    addToCart(productB);

    expect(items.value).toHaveLength(2);
  });

  it("removes a product from the cart", () => {
    const { items, addToCart, removeFromCart } = useCart();
    const product = makeProduct();

    addToCart(product);
    expect(items.value).toHaveLength(1);

    removeFromCart(product.id);
    expect(items.value).toHaveLength(0);
  });

  it("updates quantity for an existing product", () => {
    const { items, addToCart, updateQuantity } = useCart();
    const product = makeProduct();

    addToCart(product, 1);
    updateQuantity(product.id, 5);

    expect(items.value[0].quantity).toBe(5);
  });

  it("removes the product when updating quantity to 0", () => {
    const { items, addToCart, updateQuantity } = useCart();
    const product = makeProduct();

    addToCart(product, 3);
    updateQuantity(product.id, 0);

    expect(items.value).toHaveLength(0);
  });

  it("removes the product when updating quantity to a negative number", () => {
    const { items, addToCart, updateQuantity } = useCart();
    const product = makeProduct();

    addToCart(product, 2);
    updateQuantity(product.id, -1);

    expect(items.value).toHaveLength(0);
  });

  it("does nothing when updating quantity of a non-existent product", () => {
    const { items, updateQuantity } = useCart();
    updateQuantity(999, 5);
    expect(items.value).toHaveLength(0);
  });

  it("clears the entire cart", () => {
    const { items, addToCart, clearCart } = useCart();

    addToCart(makeProduct({ id: 1 }));
    addToCart(makeProduct({ id: 2 }));
    expect(items.value).toHaveLength(2);

    clearCart();
    expect(items.value).toHaveLength(0);
  });

  it("calculates cartTotal using base_price when sale_price is null", () => {
    const { addToCart, cartTotal } = useCart();

    addToCart(makeProduct({ id: 1, base_price: 100, sale_price: null }), 2);
    addToCart(makeProduct({ id: 2, base_price: 50, sale_price: null }), 1);

    // (100 * 2) + (50 * 1) = 250
    expect(cartTotal.value).toBe(250);
  });

  it("calculates cartTotal using sale_price when available", () => {
    const { addToCart, cartTotal } = useCart();

    addToCart(makeProduct({ id: 1, base_price: 100, sale_price: 80 }), 2);
    addToCart(makeProduct({ id: 2, base_price: 50, sale_price: 30 }), 3);

    // (80 * 2) + (30 * 3) = 250
    expect(cartTotal.value).toBe(250);
  });

  it("calculates cartCount as sum of all quantities", () => {
    const { addToCart, cartCount } = useCart();

    addToCart(makeProduct({ id: 1 }), 3);
    addToCart(makeProduct({ id: 2 }), 7);

    expect(cartCount.value).toBe(10);
  });

  it("returns cartTotal of 0 for an empty cart", () => {
    const { cartTotal } = useCart();
    expect(cartTotal.value).toBe(0);
  });

  it("returns cartCount of 0 for an empty cart", () => {
    const { cartCount } = useCart();
    expect(cartCount.value).toBe(0);
  });

  it("persists cart items to localStorage on add", () => {
    const { addToCart } = useCart();
    addToCart(makeProduct({ id: 1 }));

    const stored = JSON.parse(localStorage.getItem("bytedigital_cart")!);
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe(1);
  });

  it("persists cart items to localStorage on remove", () => {
    const { addToCart, removeFromCart } = useCart();
    addToCart(makeProduct({ id: 1 }));
    addToCart(makeProduct({ id: 2 }));
    removeFromCart(1);

    const stored = JSON.parse(localStorage.getItem("bytedigital_cart")!);
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe(2);
  });

  it("persists empty array to localStorage on clear", () => {
    const { addToCart, clearCart } = useCart();
    addToCart(makeProduct({ id: 1 }));
    clearCart();

    const stored = JSON.parse(localStorage.getItem("bytedigital_cart")!);
    expect(stored).toHaveLength(0);
  });

  it("loads cart items from localStorage on initialization", () => {
    const product = makeProduct({ id: 42, name: "Stored Product" });
    localStorage.setItem(
      "bytedigital_cart",
      JSON.stringify([{ product, quantity: 3 }]),
    );

    const { items } = useCart();
    expect(items.value).toHaveLength(1);
    expect(items.value[0].product.id).toBe(42);
    expect(items.value[0].quantity).toBe(3);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("bytedigital_cart", "not-valid-json{{{");

    const { items } = useCart();
    expect(items.value).toHaveLength(0);
  });
});
