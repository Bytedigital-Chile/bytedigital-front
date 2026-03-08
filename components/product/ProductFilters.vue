<template>
  <div class="space-y-6">
    <!-- Brands -->
    <div v-if="brands.length">
      <h4 class="font-semibold mb-2">Marca</h4>
      <div class="space-y-1">
        <label v-for="brand in brands" :key="brand.slug" class="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            :checked="selectedBrand === brand.slug"
            class="rounded"
            @change="$emit('update:brand', selectedBrand === brand.slug ? '' : brand.slug)"
          />
          {{ brand.name }}
        </label>
      </div>
    </div>

    <!-- Condition -->
    <div>
      <h4 class="font-semibold mb-2">Condición</h4>
      <div class="space-y-1">
        <label v-for="cond in conditions" :key="cond.value" class="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            :checked="selectedCondition === cond.value"
            class="rounded"
            @change="$emit('update:condition', selectedCondition === cond.value ? '' : cond.value)"
          />
          {{ cond.label }}
        </label>
      </div>
    </div>

    <!-- Price range -->
    <div>
      <h4 class="font-semibold mb-2">Precio</h4>
      <div class="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          :value="minPrice"
          class="w-full border rounded px-2 py-1 text-sm"
          @input="$emit('update:minPrice', Number(($event.target as HTMLInputElement).value) || undefined)"
        />
        <input
          type="number"
          placeholder="Max"
          :value="maxPrice"
          class="w-full border rounded px-2 py-1 text-sm"
          @input="$emit('update:maxPrice', Number(($event.target as HTMLInputElement).value) || undefined)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Brand } from "~/types";

defineProps<{
  brands: Brand[];
  selectedBrand: string;
  selectedCondition: string;
  minPrice?: number;
  maxPrice?: number;
}>();

defineEmits<{
  "update:brand": [value: string];
  "update:condition": [value: string];
  "update:minPrice": [value: number | undefined];
  "update:maxPrice": [value: number | undefined];
}>();

const conditions = [
  { label: "Nuevo", value: "new" },
  { label: "Open Box", value: "open_box" },
  { label: "Reacondicionado", value: "refurbished" },
];
</script>
