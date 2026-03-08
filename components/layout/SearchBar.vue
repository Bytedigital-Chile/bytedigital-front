<template>
  <div class="relative">
    <input
      v-model="query"
      type="text"
      placeholder="Buscar productos..."
      class="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm"
      @keydown.enter="goToSearch"
    />
    <svg
      class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>

    <!-- Dropdown results -->
    <div
      v-if="results.length > 0"
      class="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50"
    >
      <NuxtLink
        v-for="product in results"
        :key="product.id"
        :to="`/producto/${product.slug}`"
        class="flex items-center gap-3 p-3 hover:bg-gray-50"
        @click="query = ''"
      >
        <img
          v-if="product.images?.[0]"
          :src="product.images[0].url"
          :alt="product.name"
          class="w-10 h-10 object-cover rounded"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ product.name }}</p>
          <p class="text-sm text-primary-600 font-semibold">{{ formatCLP(product.sale_price ?? product.base_price) }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCLP } from "~/utils/format";

const { query, results } = useSearch();

function goToSearch() {
  if (query.value) {
    navigateTo(`/buscar?q=${encodeURIComponent(query.value)}`);
  }
}
</script>
