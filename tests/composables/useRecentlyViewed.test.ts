import { describe, it, expect } from "vitest";
import { useRecentlyViewed } from "~/composables/useRecentlyViewed";
import type { Product } from "~/types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Test Product",
    slug: "test-product",
    sku: null,
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

describe("useRecentlyViewed", () => {
  it("starts with an empty product list", () => {
    const { products } = useRecentlyViewed();
    expect(products.value).toHaveLength(0);
  });

  it("adds a product to recently viewed", () => {
    const { products, addProduct } = useRecentlyViewed();
    const product = makeProduct({ id: 1 });

    addProduct(product);

    expect(products.value).toHaveLength(1);
    expect(products.value[0].id).toBe(1);
  });

  it("adds multiple distinct products", () => {
    const { products, addProduct } = useRecentlyViewed();

    addProduct(makeProduct({ id: 1 }));
    addProduct(makeProduct({ id: 2 }));
    addProduct(makeProduct({ id: 3 }));

    expect(products.value).toHaveLength(3);
  });

  it("deduplicates products and moves re-added product to front", () => {
    const { products, addProduct } = useRecentlyViewed();

    addProduct(makeProduct({ id: 1, name: "First" }));
    addProduct(makeProduct({ id: 2, name: "Second" }));
    addProduct(makeProduct({ id: 3, name: "Third" }));

    // Re-add product 1 -- it should move to the front
    addProduct(makeProduct({ id: 1, name: "First Updated" }));

    expect(products.value).toHaveLength(3);
    expect(products.value[0].id).toBe(1);
    expect(products.value[0].name).toBe("First Updated");
    expect(products.value[1].id).toBe(3);
    expect(products.value[2].id).toBe(2);
  });

  it("limits the list to 10 items maximum", () => {
    const { products, addProduct } = useRecentlyViewed();

    // Add 12 products
    for (let i = 1; i <= 12; i++) {
      addProduct(makeProduct({ id: i, name: `Product ${i}` }));
    }

    expect(products.value).toHaveLength(10);
    // Most recently added should be first
    expect(products.value[0].id).toBe(12);
    // Oldest kept should be id=3 (1 and 2 were evicted)
    expect(products.value[9].id).toBe(3);
  });

  it("persists products to localStorage", () => {
    const { addProduct } = useRecentlyViewed();
    addProduct(makeProduct({ id: 1, name: "Persisted" }));

    const stored = JSON.parse(
      localStorage.getItem("bytedigital_recently_viewed")!,
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(1);
    expect(stored[0].name).toBe("Persisted");
  });

  it("loads products from localStorage on initialization", () => {
    const product = makeProduct({ id: 99, name: "Pre-stored" });
    localStorage.setItem(
      "bytedigital_recently_viewed",
      JSON.stringify([product]),
    );

    const { products } = useRecentlyViewed();
    expect(products.value).toHaveLength(1);
    expect(products.value[0].id).toBe(99);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("bytedigital_recently_viewed", "{{invalid json");

    const { products } = useRecentlyViewed();
    expect(products.value).toHaveLength(0);
  });
});
