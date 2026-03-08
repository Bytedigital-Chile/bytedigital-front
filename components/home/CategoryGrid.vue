<template>
  <section v-if="categories.length" class="my-8">
    <h2 class="text-xl font-bold mb-4">Categorías</h2>
    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/categoria/${cat.slug}`"
        class="flex flex-col items-center gap-2 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
      >
        <img
          v-if="cat.image_url"
          :src="cat.image_url"
          :alt="cat.name"
          class="w-12 h-12 object-contain"
        />
        <div v-else class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold text-lg">{{ cat.name[0] }}</span>
        </div>
        <span class="text-sm font-medium text-center">{{ cat.name }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Category } from "~/types";

defineProps<{ categories: Category[] }>();
</script>
