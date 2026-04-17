<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/40"
  >
    <div class="flex items-center gap-2 mb-3">
      <span class="text-xl">🚚</span>
      <h3 class="font-semibold text-sm">Calcula tu envío</h3>
    </div>
    <div class="grid grid-cols-2 gap-2 mb-3">
      <select
        v-model.number="selectedRegion"
        :disabled="loadingRegions"
        class="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-800"
        @change="onRegionChange"
      >
        <option :value="0">Región</option>
        <option v-for="r in regions" :key="r.id" :value="r.id">
          {{ r.name }}
        </option>
      </select>
      <select
        v-model.number="selectedComuna"
        :disabled="!selectedRegion || loadingComunas"
        class="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-800"
        @change="onComunaChange"
      >
        <option :value="0">Comuna</option>
        <option v-for="c in comunas" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <div v-if="quoting" class="text-sm text-gray-500">Calculando...</div>
    <div v-else-if="quote">
      <div
        v-if="!quote.is_deliverable"
        class="text-sm font-medium text-red-600 flex items-center gap-1"
      >
        <span>⚠</span> No despachamos a {{ quote.comuna_name }}.
      </div>
      <template v-else>
        <div
          v-if="quote.free_shipping_applied"
          class="text-sm font-medium text-green-600"
        >
          ✓ Envío gratis a {{ quote.comuna_name }}
        </div>
        <div v-else class="text-sm">
          Envío a <strong>{{ quote.comuna_name }}</strong>:
          <strong>${{ quote.price.toLocaleString("es-CL") }}</strong>
        </div>
        <div v-if="deliveryLabel" class="text-xs text-gray-500 mt-1">
          Llega en <strong>{{ deliveryLabel }}</strong>
        </div>
      </template>
    </div>
    <p v-else class="text-xs text-gray-500">
      Selecciona tu región y comuna para calcular el costo.
    </p>

    <p
      v-if="quote && quote.threshold && !quote.free_shipping_applied"
      class="text-xs text-gray-500 mt-1"
    >
      Envío gratis en compras sobre ${{ quote.threshold.toLocaleString("es-CL") }}.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ShippingQuote } from "~/composables/useShipping";

const props = withDefaults(
  defineProps<{
    subtotal?: number;
  }>(),
  { subtotal: 0 },
);

const emit = defineEmits<{
  (e: "quote", q: ShippingQuote): void;
  (e: "clear"): void;
}>();

const { fetchRegions, fetchComunas, calculate } = useShipping();

const regions = ref<{ id: number; name: string }[]>([]);
const comunas = ref<{ id: number; name: string }[]>([]);
const selectedRegion = ref(0);
const selectedComuna = ref(0);
const quote = ref<ShippingQuote | null>(null);
const loadingRegions = ref(false);
const loadingComunas = ref(false);
const quoting = ref(false);

onMounted(async () => {
  loadingRegions.value = true;
  try {
    regions.value = await fetchRegions();
  } catch {
    // silent — user sees empty dropdown
  } finally {
    loadingRegions.value = false;
  }
});

async function onRegionChange() {
  selectedComuna.value = 0;
  comunas.value = [];
  quote.value = null;
  emit("clear");
  if (!selectedRegion.value) return;
  loadingComunas.value = true;
  try {
    comunas.value = await fetchComunas(selectedRegion.value);
  } finally {
    loadingComunas.value = false;
  }
}

async function onComunaChange() {
  if (!selectedComuna.value) {
    quote.value = null;
    emit("clear");
    return;
  }
  await requote();
}

async function requote() {
  if (!selectedComuna.value) return;
  quoting.value = true;
  try {
    quote.value = await calculate(selectedComuna.value, props.subtotal);
    emit("quote", quote.value);
  } catch {
    quote.value = null;
    emit("clear");
  } finally {
    quoting.value = false;
  }
}

const deliveryLabel = computed(() => {
  if (!quote.value) return null;
  const min = quote.value.delivery_hours_min;
  const max = quote.value.delivery_hours_max;
  if (min == null && max == null) return null;
  // If both hours are multiples of 24 and big enough, render as days.
  const renderDay = (h: number) => (h % 24 === 0 ? `${h / 24}` : `${h}h`);
  if (min != null && max != null) {
    if (min >= 24 && max >= 24 && min % 24 === 0 && max % 24 === 0) {
      return `${min / 24}–${max / 24} días hábiles`;
    }
    return `${renderDay(min)}–${renderDay(max)} hrs.`;
  }
  const only = (min ?? max) as number;
  if (only >= 24 && only % 24 === 0) return `${only / 24} días hábiles`;
  return `${only} hrs.`;
});

// Re-quote when subtotal changes (useful on cart where items can be edited)
watch(
  () => props.subtotal,
  () => {
    if (selectedComuna.value) requote();
  },
);
</script>
