<template>
  <section v-if="products.length" ref="target" class="my-10">
    <HomeSectionHeader title="Vistos Recientemente" />
    <div :class="isVisible ? 'reveal-visible' : 'reveal-hidden'">
      <ProductGrid :products="products" />
    </div>
  </section>
</template>

<script setup lang="ts">
const { products } = useRecentlyViewed();

const { target, isVisible } = useScrollReveal();
</script>
