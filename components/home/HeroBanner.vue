<template>
  <div v-if="banners.length" class="relative overflow-hidden rounded-xl shadow-lg">
    <div class="relative h-56 md:h-80 lg:h-[360px]">
      <!-- Slides with crossfade -->
      <template v-for="(banner, idx) in banners" :key="banner.id">
        <div
          class="absolute inset-0 transition-opacity duration-700 ease-in-out"
          :class="idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'"
        >
          <NuxtLink :to="banner.link_url || '#'" class="block w-full h-full">
            <img
              :src="banner.image_url"
              :alt="banner.title"
              class="w-full h-full object-cover"
            />
            <!-- Dramatic gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <!-- Content -->
            <div class="absolute bottom-12 md:bottom-16 left-8 md:left-12 text-white max-w-lg">
              <h2 class="text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                {{ banner.title }}
              </h2>
              <p class="mt-3 text-sm md:text-base text-white/80">
                Encuentra las mejores ofertas en tecnología
              </p>
              <span
                class="inline-block mt-4 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Ver ofertas
              </span>
            </div>
          </NuxtLink>
        </div>
      </template>

      <!-- Navigation arrows -->
      <template v-if="banners.length > 1">
        <button
          class="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors flex items-center justify-center text-white"
          @click="prev"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button
          class="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors flex items-center justify-center text-white"
          @click="next"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </template>
    </div>

    <!-- Styled dots -->
    <div v-if="banners.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      <button
        v-for="(_, idx) in banners"
        :key="idx"
        class="transition-all duration-300 rounded-full"
        :class="idx === currentIndex ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'"
        @click="goTo(idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import type { Banner } from "~/types";

const props = defineProps<{ banners: Banner[] }>();
const currentIndex = ref(0);

let interval: ReturnType<typeof setInterval>;

function resetInterval() {
  clearInterval(interval);
  if (props.banners.length > 1) {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.banners.length;
    }, 5000);
  }
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.banners.length;
  resetInterval();
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.banners.length) % props.banners.length;
  resetInterval();
}

function goTo(idx: number) {
  currentIndex.value = idx;
  resetInterval();
}

onMounted(() => resetInterval());
onUnmounted(() => clearInterval(interval));
</script>
