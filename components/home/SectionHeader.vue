<template>
  <div
    ref="target"
    class="flex items-end justify-between mb-6"
    :class="isVisible ? 'reveal-visible' : 'reveal-hidden'"
  >
    <div>
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
        <span
          v-if="badge"
          class="text-xs font-bold px-2.5 py-1 rounded-full"
          :class="badgeClass"
        >
          {{ badge }}
        </span>
      </div>
      <div class="mt-2 h-1 w-12 rounded-full bg-primary-500" />
    </div>
    <NuxtLink
      v-if="viewAllLink"
      :to="viewAllLink"
      class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
    >
      Ver todos
      <ArrowRight class="w-4 h-4" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";

defineProps<{
  title: string;
  badge?: string;
  badgeClass?: string;
  viewAllLink?: string;
}>();

const { target, isVisible } = useScrollReveal();
</script>
