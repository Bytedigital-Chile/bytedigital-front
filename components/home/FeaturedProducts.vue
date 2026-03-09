<template>
  <section v-if="products.length" ref="target" class="my-10">
    <HomeSectionHeader title="Productos Destacados" badge="TOP" badge-class="bg-primary-100 text-primary-600" />
    <div :class="isVisible ? 'reveal-visible' : 'reveal-hidden'">
      <ProductGrid :products="products" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from "~/types";

defineProps<{ products: Product[] }>();

const { target, isVisible } = useScrollReveal();
</script>
