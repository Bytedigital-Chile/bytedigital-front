<template>
  <div>
    <div v-if="product.sale_price && product.sale_price < product.base_price">
      <p class="text-xs text-gray-400 line-through">{{ formatCLP(product.base_price) }}</p>
      <p class="text-lg font-bold text-primary-600">{{ formatCLP(product.sale_price) }}</p>
      <p class="text-xs text-gray-500">Precio contado</p>
    </div>
    <div v-else>
      <p class="text-lg font-bold text-gray-900">{{ formatCLP(product.base_price) }}</p>
      <p class="text-xs text-gray-500">Precio contado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types";
import { formatCLP } from "~/utils/format";

defineProps<{ product: Product }>();
</script>
