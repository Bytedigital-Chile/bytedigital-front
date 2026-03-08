<template>
  <section v-if="products.length" class="my-8">
    <h2 class="text-xl font-bold mb-4">Vistos Recientemente</h2>
    <ProductProductGrid :products="products" />
  </section>
</template>

<script setup lang="ts">
const { products } = useRecentlyViewed();
</script>
