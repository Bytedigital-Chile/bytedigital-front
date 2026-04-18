<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/40"
  >
    <div class="flex items-center gap-2 mb-3">
      <span class="text-xl">🚚</span>
      <h3 class="font-semibold text-sm">Calcula tu envío</h3>
    </div>

    <!-- ── Lista de direcciones del usuario autenticado ── -->
    <template v-if="isAuthenticated">
      <div v-if="loadingAddresses" class="text-xs text-gray-500">
        Cargando tus direcciones…
      </div>

      <div v-else-if="addresses.length > 0" class="space-y-2 mb-3">
        <label
          v-for="addr in addresses"
          :key="addr.id"
          class="flex items-start gap-3 border rounded-lg p-3 cursor-pointer bg-white dark:bg-gray-800 transition-colors"
          :class="selectedAddressId === addr.id
            ? 'border-primary-500 ring-1 ring-primary-500'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'"
        >
          <input
            v-model.number="selectedAddressId"
            type="radio"
            :value="addr.id"
            class="mt-1"
            @change="onAddressSelect(addr)"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm font-semibold">{{ addr.label }}</span>
              <span
                v-if="addr.is_default"
                class="text-[10px] uppercase tracking-wide bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded"
              >Predeterminada</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
              {{ addr.street }} {{ addr.number }}{{ addr.apartment ? `, ${addr.apartment}` : "" }},
              {{ addr.comuna }}, {{ addr.region }}
            </p>
            <div class="text-xs mt-1 min-h-[1.25rem]">
              <span v-if="addressQuotes[addr.id]?.loading" class="text-gray-500">
                Calculando…
              </span>
              <span
                v-else-if="addressQuotes[addr.id]?.quote?.free_shipping_applied"
                class="text-green-600 font-medium"
              >
                ✓ Envío gratis
              </span>
              <span
                v-else-if="addressQuotes[addr.id]?.quote?.is_deliverable"
                class="font-medium"
              >
                Envío: ${{ addressQuotes[addr.id].quote!.price.toLocaleString("es-CL") }}
              </span>
              <span
                v-else-if="addressQuotes[addr.id]?.quote && !addressQuotes[addr.id].quote!.is_deliverable"
                class="text-red-600"
              >
                ⚠ No despachamos aquí
              </span>
              <span
                v-else-if="addressQuotes[addr.id]?.error"
                class="text-red-500"
              >
                No se pudo cotizar (comuna no reconocida)
              </span>
            </div>
          </div>
        </label>

        <div class="flex items-center gap-3 pt-1">
          <NuxtLink
            to="/mi-cuenta/direcciones"
            class="text-xs text-primary-600 hover:underline"
          >
            + Agregar / editar direcciones
          </NuxtLink>
          <button
            type="button"
            class="text-xs text-gray-500 hover:text-gray-700 underline"
            @click="showManual = !showManual"
          >
            {{ showManual ? "Ocultar" : "Cotizar a otra comuna" }}
          </button>
        </div>
      </div>

      <div
        v-else
        class="bg-white dark:bg-gray-800 border border-dashed border-gray-300 rounded-lg p-4 text-center mb-3"
      >
        <p class="text-sm text-gray-600 mb-2">Aún no tienes direcciones guardadas.</p>
        <NuxtLink
          to="/mi-cuenta/direcciones"
          class="inline-block bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Agregar dirección
        </NuxtLink>
        <p class="mt-3 text-xs text-gray-500">
          O cotiza a una comuna sin guardarla:
        </p>
      </div>
    </template>

    <!-- ── Calculador manual (siempre disponible para anónimos + opcional en auth) ── -->
    <div v-if="!isAuthenticated || addresses.length === 0 || showManual">
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
  </div>
</template>

<script setup lang="ts">
import type { ShippingQuote } from "~/composables/useShipping";

interface CustomerAddress {
  id: number;
  label: string;
  street: string;
  number: string;
  apartment: string | null;
  comuna: string;
  region: string;
  is_default: boolean;
}

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

const { api } = useApi();
const { isAuthenticated } = useAuth();
const { fetchRegions, fetchComunas, calculate } = useShipping();

// — Manual selector state —
const regions = ref<{ id: number; name: string }[]>([]);
const comunas = ref<{ id: number; name: string }[]>([]);
const selectedRegion = ref(0);
const selectedComuna = ref(0);
const quote = ref<ShippingQuote | null>(null);
const loadingRegions = ref(false);
const loadingComunas = ref(false);
const quoting = ref(false);
const showManual = ref(false);

// — Authenticated addresses state —
const addresses = ref<CustomerAddress[]>([]);
const loadingAddresses = ref(false);
const selectedAddressId = ref<number | null>(null);
const addressQuotes = reactive<
  Record<number, { loading: boolean; quote?: ShippingQuote; error?: boolean }>
>({});

// Cache regions and comunas to avoid refetching per address.
let regionsCache: { id: number; name: string }[] | null = null;
const comunasCache: Record<number, { id: number; name: string }[]> = {};

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function resolveComunaId(address: CustomerAddress): Promise<number | null> {
  if (!regionsCache) regionsCache = await fetchRegions();
  const region = regionsCache.find((r) => normalize(r.name) === normalize(address.region));
  if (!region) return null;
  if (!comunasCache[region.id]) comunasCache[region.id] = await fetchComunas(region.id);
  const comuna = comunasCache[region.id].find(
    (c) => normalize(c.name) === normalize(address.comuna),
  );
  return comuna?.id ?? null;
}

async function quoteAddress(address: CustomerAddress) {
  addressQuotes[address.id] = { loading: true };
  try {
    const comunaId = await resolveComunaId(address);
    if (!comunaId) {
      addressQuotes[address.id] = { loading: false, error: true };
      return null;
    }
    const q = await calculate(comunaId, props.subtotal);
    addressQuotes[address.id] = { loading: false, quote: q };
    return q;
  } catch {
    addressQuotes[address.id] = { loading: false, error: true };
    return null;
  }
}

async function onAddressSelect(address: CustomerAddress) {
  const existing = addressQuotes[address.id]?.quote;
  const q = existing ?? (await quoteAddress(address));
  if (q) emit("quote", q);
  else emit("clear");
}

onMounted(async () => {
  // Cargar direcciones del usuario si está logueado
  if (isAuthenticated.value) {
    loadingAddresses.value = true;
    try {
      addresses.value = await api<CustomerAddress[]>("/account/addresses");
      // Pre-cotizar cada dirección
      await Promise.all(addresses.value.map((a) => quoteAddress(a)));
      // Seleccionar la default (o la primera) automáticamente
      const pre = addresses.value.find((a) => a.is_default) || addresses.value[0];
      if (pre) {
        selectedAddressId.value = pre.id;
        const q = addressQuotes[pre.id]?.quote;
        if (q) emit("quote", q);
      }
    } catch {
      addresses.value = [];
    } finally {
      loadingAddresses.value = false;
    }
  }

  // Cargar regiones para el selector manual
  loadingRegions.value = true;
  try {
    regions.value = await fetchRegions();
  } catch {
    // silent
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
    // El manual tiene prioridad si está visible y se usó.
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

// Re-quote when subtotal changes
watch(
  () => props.subtotal,
  () => {
    if (selectedComuna.value) requote();
    // Re-cotizar todas las direcciones si cambia el subtotal
    for (const addr of addresses.value) {
      quoteAddress(addr).then((q) => {
        if (q && addr.id === selectedAddressId.value) emit("quote", q);
      });
    }
  },
);
</script>
