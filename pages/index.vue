<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div v-if="status === 'pending'" class="space-y-8">
      <div class="h-72 md:h-[500px] bg-gray-200 rounded-xl animate-pulse" />
      <div class="grid grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-20 bg-gray-200 rounded-xl animate-pulse" />
      </div>
      <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="h-28 bg-gray-200 rounded-xl animate-pulse" />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-72 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
    <template v-else>
      <HomeHeroBanner :banners="banners" />

      <!-- Benefits bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
        <div
          v-for="benefit in benefits"
          :key="benefit.label"
          class="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
        >
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <component :is="benefit.icon" class="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ benefit.label }}</p>
            <p class="text-xs text-gray-500">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>

      <HomeCategoryGrid :categories="categories" />
      <HomeOfferSection :offers="offers" />
      <HomeFeaturedProducts :products="featured" />
      <HomeNewProducts :products="newProducts" />
      <HomeRecommendedProducts />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-vue-next";
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

const benefits = [
  { icon: Truck, label: "Envío gratis", desc: "En compras sobre $50.000" },
  { icon: ShieldCheck, label: "Compra segura", desc: "Pago 100% protegido" },
  { icon: RotateCcw, label: "Garantía", desc: "Cambios y devoluciones" },
  { icon: Headphones, label: "Soporte 24/7", desc: "Te ayudamos siempre" },
];
</script>
