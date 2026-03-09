<template>
  <!-- Loading -->
  <div v-if="loading" class="max-w-7xl mx-auto px-4 py-6">
    <div class="h-48 md:h-64 bg-gray-200 rounded-lg animate-pulse mb-8" />
    <div class="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-4" />
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-64 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
  <!-- Not found -->
  <div v-else-if="notFound" class="max-w-7xl mx-auto px-4 py-16 text-center">
    <p class="text-gray-500 text-lg">Campana no encontrada</p>
    <NuxtLink to="/" class="text-primary-600 hover:underline mt-4 inline-block">Volver al inicio</NuxtLink>
  </div>
  <!-- Campaign content -->
  <div v-else-if="campaign" class="max-w-7xl mx-auto px-4 py-6">
    <!-- Hero -->
    <div v-if="campaign.image_url" class="rounded-lg overflow-hidden mb-8">
      <img :src="campaign.image_url" :alt="campaign.name" class="w-full h-48 md:h-64 object-cover" />
    </div>

    <h1 class="text-3xl font-bold mb-2">{{ campaign.name }}</h1>
    <p v-if="campaign.description" class="text-gray-600 mb-8">{{ campaign.description }}</p>

    <ProductGrid :products="campaign.products" />
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from "~/types";

const route = useRoute();
const { api } = useApi();
const campaign = ref<Campaign | null>(null);
const loading = ref(true);
const notFound = ref(false);

onMounted(async () => {
  try {
    campaign.value = await api<Campaign>(`/campaigns/${route.params.slug}`);
  } catch {
    notFound.value = true;
  } finally {
    loading.value = false;
  }
});

useHead(() => ({
  title: campaign.value ? `${campaign.value.name} - ByteDigital` : "Campana - ByteDigital",
}));
</script>
