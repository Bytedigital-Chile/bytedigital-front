<template>
  <div class="flex gap-3">
    <!-- Thumbnails verticales (desktop) / horizontales (mobile) -->
    <div
      v-if="images.length > 1"
      class="flex md:flex-col gap-2 order-2 md:order-1 flex-shrink-0 overflow-x-auto md:overflow-y-auto md:max-h-[560px]"
      :style="{ scrollbarWidth: 'thin' }"
    >
      <button
        v-for="(img, idx) in images"
        :key="img.id"
        type="button"
        class="w-16 h-16 md:w-20 md:h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 transition-colors"
        :class="selectedIndex === idx ? 'border-primary-500 ring-1 ring-primary-500/40' : 'border-gray-200 hover:border-gray-300'"
        :aria-label="img.alt || `Imagen ${idx + 1}`"
        @mouseenter="onThumbHover(idx)"
        @click="selectedIndex = idx"
      >
        <img :src="img.url" :alt="img.alt || ''" class="w-full h-full object-contain" />
      </button>
    </div>

    <!-- Imagen grande -->
    <div class="order-1 md:order-2 flex-1 min-w-0">
      <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          v-if="selectedImage"
          :src="selectedImage.url"
          :alt="selectedImage.alt || 'Product'"
          class="w-full h-full object-contain p-4"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from "~/types";

const props = defineProps<{ images: ProductImage[] }>();

const selectedIndex = ref(0);
const selectedImage = computed(() => props.images[selectedIndex.value]);

let hoverTimer: ReturnType<typeof setTimeout> | null = null;
function onThumbHover(idx: number) {
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => {
    selectedIndex.value = idx;
  }, 120);
}
</script>
