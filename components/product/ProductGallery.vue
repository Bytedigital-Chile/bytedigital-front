<template>
  <div>
    <!-- Main image -->
    <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
      <img
        v-if="selectedImage"
        :src="selectedImage.url"
        :alt="selectedImage.alt || 'Product'"
        class="w-full h-full object-contain p-4"
      />
    </div>
    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto">
      <button
        v-for="(img, idx) in images"
        :key="img.id"
        class="w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0"
        :class="selectedIndex === idx ? 'border-primary-500' : 'border-gray-200'"
        @click="selectedIndex = idx"
      >
        <img :src="img.url" :alt="img.alt || ''" class="w-full h-full object-contain" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from "~/types";

const props = defineProps<{ images: ProductImage[] }>();

const selectedIndex = ref(0);
const selectedImage = computed(() => props.images[selectedIndex.value]);
</script>
