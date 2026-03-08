<template>
  <section v-if="offers.length" class="my-8">
    <div class="flex items-center gap-2 mb-4">
      <h2 class="text-xl font-bold text-red-600">Ofertas Imperdibles</h2>
      <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">HOT</span>
    </div>
    <ProductProductGrid :products="offers.map(o => o.product)" />
  </section>
</template>

<script setup lang="ts">
import type { Offer } from "~/types";

defineProps<{ offers: Offer[] }>();
</script>
