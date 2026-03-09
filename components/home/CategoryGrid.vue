<template>
  <section v-if="categories.length" ref="target" class="my-10">
    <HomeSectionHeader title="Categorías" view-all-link="/buscar" />
    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <NuxtLink
        v-for="(cat, idx) in categories"
        :key="cat.id"
        :to="`/categoria/${cat.slug}`"
        class="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-gray-100 hover:shadow-lg hover:shadow-primary-100 hover:-translate-y-1 hover:border-primary-200 transition-all duration-300"
        :class="[
          isVisible ? 'reveal-visible' : 'reveal-hidden',
          `stagger-${Math.min(idx + 1, 10)}`
        ]"
      >
        <div
          class="w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300"
          :class="categoryStyle(cat.slug).bg"
        >
          <component
            :is="categoryStyle(cat.slug).icon"
            class="w-7 h-7 transition-colors duration-300"
            :class="categoryStyle(cat.slug).text"
          />
        </div>
        <span class="text-sm font-medium text-center text-gray-700 group-hover:text-primary-600 transition-colors">
          {{ cat.name }}
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Laptop, Monitor, Cpu, Mouse, Wifi, Printer,
  Smartphone, Gamepad2, HardDrive, Keyboard,
  Package,
} from "lucide-vue-next";
import type { Category } from "~/types";
import type { Component } from "vue";

defineProps<{ categories: Category[] }>();

const { target, isVisible } = useScrollReveal();

const iconMap: Record<string, { icon: Component; bg: string; text: string }> = {
  notebooks: { icon: Laptop, bg: "bg-blue-50 group-hover:bg-blue-100", text: "text-blue-500 group-hover:text-blue-600" },
  laptops: { icon: Laptop, bg: "bg-blue-50 group-hover:bg-blue-100", text: "text-blue-500 group-hover:text-blue-600" },
  monitores: { icon: Monitor, bg: "bg-purple-50 group-hover:bg-purple-100", text: "text-purple-500 group-hover:text-purple-600" },
  procesadores: { icon: Cpu, bg: "bg-orange-50 group-hover:bg-orange-100", text: "text-orange-500 group-hover:text-orange-600" },
  componentes: { icon: Cpu, bg: "bg-orange-50 group-hover:bg-orange-100", text: "text-orange-500 group-hover:text-orange-600" },
  perifericos: { icon: Mouse, bg: "bg-green-50 group-hover:bg-green-100", text: "text-green-500 group-hover:text-green-600" },
  mouse: { icon: Mouse, bg: "bg-green-50 group-hover:bg-green-100", text: "text-green-500 group-hover:text-green-600" },
  redes: { icon: Wifi, bg: "bg-cyan-50 group-hover:bg-cyan-100", text: "text-cyan-500 group-hover:text-cyan-600" },
  networking: { icon: Wifi, bg: "bg-cyan-50 group-hover:bg-cyan-100", text: "text-cyan-500 group-hover:text-cyan-600" },
  impresoras: { icon: Printer, bg: "bg-rose-50 group-hover:bg-rose-100", text: "text-rose-500 group-hover:text-rose-600" },
  smartphones: { icon: Smartphone, bg: "bg-indigo-50 group-hover:bg-indigo-100", text: "text-indigo-500 group-hover:text-indigo-600" },
  celulares: { icon: Smartphone, bg: "bg-indigo-50 group-hover:bg-indigo-100", text: "text-indigo-500 group-hover:text-indigo-600" },
  gaming: { icon: Gamepad2, bg: "bg-red-50 group-hover:bg-red-100", text: "text-red-500 group-hover:text-red-600" },
  almacenamiento: { icon: HardDrive, bg: "bg-amber-50 group-hover:bg-amber-100", text: "text-amber-500 group-hover:text-amber-600" },
  teclados: { icon: Keyboard, bg: "bg-teal-50 group-hover:bg-teal-100", text: "text-teal-500 group-hover:text-teal-600" },
};

const defaultStyle = { icon: Package, bg: "bg-gray-50 group-hover:bg-gray-100", text: "text-gray-500 group-hover:text-gray-600" };

function categoryStyle(slug: string) {
  return iconMap[slug] ?? defaultStyle;
}
</script>
