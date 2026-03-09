<template>
  <nav class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center gap-1 h-11 overflow-x-auto scrollbar-hide text-sm">
        <NuxtLink
          v-for="cat in categories ?? []"
          :key="cat.id"
          :to="`/categoria/${cat.slug}`"
          class="relative whitespace-nowrap text-gray-600 hover:text-primary-600 font-medium px-3 py-2 rounded-md hover:bg-primary-50 transition-all duration-200 flex items-center gap-1.5"
        >
          <component :is="categoryIcon(cat.slug)" class="w-3.5 h-3.5" />
          {{ cat.name }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  Laptop, Monitor, Cpu, Mouse, Wifi, Printer,
  Smartphone, Gamepad2, HardDrive, Keyboard, Package,
} from "lucide-vue-next";
import type { Category } from "~/types";
import type { Component } from "vue";

const { api } = useApi();
const { data: categories } = await useAsyncData("nav-categories", () =>
  api<Category[]>("/categories/").catch(() => []),
);

const icons: Record<string, Component> = {
  notebooks: Laptop,
  laptops: Laptop,
  monitores: Monitor,
  procesadores: Cpu,
  componentes: Cpu,
  perifericos: Mouse,
  mouse: Mouse,
  redes: Wifi,
  networking: Wifi,
  impresoras: Printer,
  smartphones: Smartphone,
  celulares: Smartphone,
  gaming: Gamepad2,
  almacenamiento: HardDrive,
  teclados: Keyboard,
};

function categoryIcon(slug: string): Component {
  return icons[slug] ?? Package;
}
</script>
