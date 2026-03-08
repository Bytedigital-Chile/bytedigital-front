<template>
  <div v-if="banners.length" class="relative overflow-hidden rounded-lg">
    <div class="relative h-64 md:h-96">
      <NuxtLink v-if="banners[currentIndex]" :to="banners[currentIndex].link_url || '#'">
        <img
          :src="banners[currentIndex].image_url"
          :alt="banners[currentIndex].title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <div class="absolute bottom-8 left-8 text-white">
          <h2 class="text-2xl md:text-4xl font-bold">{{ banners[currentIndex].title }}</h2>
        </div>
      </NuxtLink>
    </div>
    <!-- Dots -->
    <div v-if="banners.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, idx) in banners"
        :key="idx"
        class="w-3 h-3 rounded-full transition-colors"
        :class="idx === currentIndex ? 'bg-white' : 'bg-white/50'"
        @click="currentIndex = idx"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Banner } from "~/types";

const props = defineProps<{ banners: Banner[] }>();
const currentIndex = ref(0);

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  if (props.banners.length > 1) {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.banners.length;
    }, 5000);
  }
});

onUnmounted(() => clearInterval(interval));
</script>
