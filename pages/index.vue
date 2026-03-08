<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <HomeHeroBanner :banners="banners" />
    <HomeCategoryGrid :categories="categories" />
    <HomeOfferSection :offers="offers" />
    <HomeFeaturedProducts :products="featured" />
    <HomeNewProducts :products="newProducts" />
    <HomeRecommendedProducts />
  </div>
</template>

<script setup lang="ts">
import type { Banner, Category, Offer, Product } from "~/types";

const { api } = useApi();

const banners = ref<Banner[]>([]);
const categories = ref<Category[]>([]);
const offers = ref<Offer[]>([]);
const featured = ref<Product[]>([]);
const newProducts = ref<Product[]>([]);

onMounted(async () => {
  try {
    const [b, c, o, f, n] = await Promise.all([
      api<Banner[]>("/banners/?banner_type=hero"),
      api<Category[]>("/categories/"),
      api<Offer[]>("/offers/"),
      api<Product[]>("/products/featured"),
      api<Product[]>("/products/new"),
    ]);
    banners.value = b;
    categories.value = c;
    offers.value = o;
    featured.value = f;
    newProducts.value = n;
  } catch {
    // API not available
  }
});
</script>
