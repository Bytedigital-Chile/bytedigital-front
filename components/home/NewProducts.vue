<template>
  <section v-if="products.length" ref="target" class="my-10">
    <HomeSectionHeader title="Nuevos Productos" badge="NUEVO" badge-class="bg-emerald-100 text-emerald-600" />
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
