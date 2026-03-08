<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div v-if="status === 'pending'" class="space-y-8">
      <div class="h-64 md:h-96 bg-gray-200 rounded-lg animate-pulse" />
      <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div v-for="i in 6" :key="i" class="h-24 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
    <template v-else>
      <HomeHeroBanner :banners="banners" />
      <HomeCategoryGrid :categories="categories" />
      <HomeOfferSection :offers="offers" />
      <HomeFeaturedProducts :products="featured" />
      <HomeNewProducts :products="newProducts" />
      <HomeRecommendedProducts />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Banner, Category, Offer, Product } from "~/types";

const { api } = useApi();

const { data, status } = await useAsyncData("home", async () => {
  const [banners, categories, offers, featured, newProducts] = await Promise.all([
    api<Banner[]>("/banners/?banner_type=hero"),
    api<Category[]>("/categories/"),
    api<Offer[]>("/offers/"),
    api<Product[]>("/products/featured"),
    api<Product[]>("/products/new"),
  ]);
  return { banners, categories, offers, featured, newProducts };
});

const banners = computed(() => data.value?.banners ?? []);
const categories = computed(() => data.value?.categories ?? []);
const offers = computed(() => data.value?.offers ?? []);
const featured = computed(() => data.value?.featured ?? []);
const newProducts = computed(() => data.value?.newProducts ?? []);
</script>
