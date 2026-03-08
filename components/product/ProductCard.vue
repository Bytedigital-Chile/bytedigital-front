<template>
  <NuxtLink :to="`/producto/${product.slug}`" class="group">
    <div class="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <!-- Image -->
      <div class="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          v-if="product.images?.[0]"
          :src="product.images[0].url"
          :alt="product.name"
          class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <!-- Discount badge -->
        <span
          v-if="product.sale_price && product.sale_price < product.base_price"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
        >
          -{{ calcDiscount(product.base_price, product.sale_price) }}%
        </span>
      </div>

      <!-- Info -->
      <div class="p-3">
        <p class="text-xs text-gray-500 mb-1">{{ product.brand?.name }}</p>
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {{ product.name }}
        </h3>
        <div class="mt-2">
          <ProductPriceDisplay :product="product" />
        </div>
        <p v-if="product.stock > 0" class="text-xs text-green-600 mt-1">En stock</p>
        <p v-else class="text-xs text-red-500 mt-1">Sin stock</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from "~/types";
import { calcDiscount } from "~/utils/format";

defineProps<{ product: Product }>();
</script>
