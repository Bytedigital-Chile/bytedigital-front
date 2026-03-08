<template>
  <div v-if="campaign" class="max-w-7xl mx-auto px-4 py-6">
    <!-- Hero -->
    <div v-if="campaign.image_url" class="rounded-lg overflow-hidden mb-8">
      <img :src="campaign.image_url" :alt="campaign.name" class="w-full h-48 md:h-64 object-cover" />
    </div>

    <h1 class="text-3xl font-bold mb-2">{{ campaign.name }}</h1>
    <p v-if="campaign.description" class="text-gray-600 mb-8">{{ campaign.description }}</p>

    <ProductProductGrid :products="campaign.products" />
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from "~/types";

const route = useRoute();
const { api } = useApi();
const campaign = ref<Campaign | null>(null);

onMounted(async () => {
  try {
    campaign.value = await api<Campaign>(`/campaigns/${route.params.slug}`);
  } catch {
    // Not found
  }
});

useHead(() => ({
  title: campaign.value ? `${campaign.value.name} - ByteDigital` : "Campaña - ByteDigital",
}));
</script>
