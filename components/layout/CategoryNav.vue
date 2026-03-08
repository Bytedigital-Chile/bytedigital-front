<template>
  <nav class="bg-gray-100 border-b">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center gap-6 h-10 overflow-x-auto text-sm">
        <NuxtLink
          v-for="cat in categories ?? []"
          :key="cat.id"
          :to="`/categoria/${cat.slug}`"
          class="whitespace-nowrap text-gray-700 hover:text-primary-600 font-medium"
        >
          {{ cat.name }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Category } from "~/types";

const { api } = useApi();
const { data: categories } = await useAsyncData("nav-categories", () =>
  api<Category[]>("/categories/").catch(() => [])
);
</script>
