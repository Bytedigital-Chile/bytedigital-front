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

    <!-- Dynamic filters -->
    <template v-for="filter in dynamicFilters" :key="filter.attribute_id">
      <!-- Select type: checkbox group with counts -->
      <div v-if="filter.attribute_type === 'select' && filter.options.length > 0">
        <h4 class="font-semibold mb-2">{{ filter.name }}</h4>
        <div class="space-y-1">
          <label
            v-for="opt in filter.options"
            :key="opt.id"
            class="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="attrFilters[`attr_${filter.attribute_id}`] === String(opt.id)"
              class="rounded"
              @change="toggleAttrFilter(filter.attribute_id, opt.id)"
            />
            {{ opt.value }}
            <span class="text-gray-400 text-xs">({{ opt.count }})</span>
          </label>
        </div>
      </div>

      <!-- Number type: min/max inputs -->
      <div v-else-if="filter.attribute_type === 'number' && (filter.min_value !== null || filter.max_value !== null)">
        <h4 class="font-semibold mb-2">{{ filter.name }}<span v-if="filter.unit" class="text-gray-400 text-xs ml-1">({{ filter.unit }})</span></h4>
        <div class="flex gap-2">
          <input
            type="number"
            :placeholder="filter.min_value !== null ? String(filter.min_value) : 'Min'"
            :value="attrFilters[`attr_${filter.attribute_id}_min`] || ''"
            class="w-full border rounded px-2 py-1 text-sm"
            @input="setAttrRangeFilter(filter.attribute_id, 'min', ($event.target as HTMLInputElement).value)"
          />
          <input
            type="number"
            :placeholder="filter.max_value !== null ? String(filter.max_value) : 'Max'"
            :value="attrFilters[`attr_${filter.attribute_id}_max`] || ''"
            class="w-full border rounded px-2 py-1 text-sm"
            @input="setAttrRangeFilter(filter.attribute_id, 'max', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <!-- Boolean type: toggle -->
      <div v-else-if="filter.attribute_type === 'boolean'">
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            :checked="attrFilters[`attr_${filter.attribute_id}`] === 'true'"
            class="rounded"
            @change="toggleBooleanFilter(filter.attribute_id)"
          />
          <span class="font-semibold">{{ filter.name }}</span>
        </label>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Brand, FilterDefinition } from "~/types";

const props = defineProps<{
  brands: Brand[];
  selectedBrand: string;
  selectedCondition: string;
  minPrice?: number;
  maxPrice?: number;
  dynamicFilters?: FilterDefinition[];
  attrFilters?: Record<string, string>;
}>();

const emit = defineEmits<{
  "update:brand": [value: string];
  "update:condition": [value: string];
  "update:minPrice": [value: number | undefined];
  "update:maxPrice": [value: number | undefined];
  "update:attrFilters": [value: Record<string, string>];
}>();

const conditions = [
  { label: "Nuevo", value: "new" },
  { label: "Open Box", value: "open_box" },
  { label: "Reacondicionado", value: "refurbished" },
];

const attrFilters = computed(() => props.attrFilters || {});

function emitAttrUpdate(newFilters: Record<string, string>) {
  emit("update:attrFilters", newFilters);
}

function toggleAttrFilter(attrId: number, optionId: number) {
  const key = `attr_${attrId}`;
  const current = { ...attrFilters.value };
  if (current[key] === String(optionId)) {
    delete current[key];
  } else {
    current[key] = String(optionId);
  }
  emitAttrUpdate(current);
}

function setAttrRangeFilter(attrId: number, bound: "min" | "max", value: string) {
  const key = `attr_${attrId}_${bound}`;
  const current = { ...attrFilters.value };
  if (value) {
    current[key] = value;
  } else {
    delete current[key];
  }
  emitAttrUpdate(current);
}

function toggleBooleanFilter(attrId: number) {
  const key = `attr_${attrId}`;
  const current = { ...attrFilters.value };
  if (current[key] === "true") {
    delete current[key];
  } else {
    current[key] = "true";
  }
  emitAttrUpdate(current);
}
</script>
