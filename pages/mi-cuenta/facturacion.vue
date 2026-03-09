<template>
  <div>
    <h2 class="text-xl font-bold mb-6">Datos de facturación</h2>
    <form class="space-y-4 max-w-md" @submit.prevent="save">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">RUT</label>
        <input
          v-model="form.rut"
          type="text"
          required
          class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="76.123.456-7"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Razón social</label>
        <input
          v-model="form.razon_social"
          type="text"
          required
          class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Giro (opcional)</label>
        <input
          v-model="form.giro"
          type="text"
          class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Calle</label>
          <input v-model="form.street" type="text" required class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
          <input v-model="form.number" type="text" required class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Región</label>
          <select v-model="selectedRegionId" required class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="" disabled>Selecciona región</option>
            <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
          <select v-model="form.comuna" required :disabled="!selectedRegionId" class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-gray-100">
            <option value="" disabled>Selecciona comuna</option>
            <option v-for="c in comunas" :key="c.id" :value="c.name">{{ c.name }}</option>
          </select>
        </div>
      </div>
      <p v-if="message" class="text-sm" :class="messageError ? 'text-red-500' : 'text-green-600'">{{ message }}</p>
      <button
        type="submit"
        :disabled="saving"
        class="bg-primary-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {{ saving ? "Guardando..." : "Guardar" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { BillingProfile, Region, ComunaOption } from "~/types";

const { api } = useApi();

const existing = ref<BillingProfile | null>(null);
const saving = ref(false);
const message = ref("");
const messageError = ref(false);

// Geography data
const regions = ref<Region[]>([]);
const comunas = ref<ComunaOption[]>([]);
const selectedRegionId = ref<number | string>("");

const form = reactive({
  rut: "",
  razon_social: "",
  giro: "",
  street: "",
  number: "",
  comuna: "",
  region: "",
});

// Watch region change → load comunas
watch(selectedRegionId, async (regionId) => {
  if (!regionId) {
    comunas.value = [];
    form.comuna = "";
    form.region = "";
    return;
  }
  const region = regions.value.find((r) => r.id === regionId);
  if (region) form.region = region.name;
  comunas.value = await api<ComunaOption[]>(`/geography/regions/${regionId}/comunas`).catch(() => []);
  if (!comunas.value.some((c) => c.name === form.comuna)) {
    form.comuna = "";
  }
});

async function load() {
  try {
    const data = await api<BillingProfile | null>("/account/billing");
    if (data) {
      existing.value = data;
      form.rut = data.rut;
      form.razon_social = data.razon_social;
      form.giro = data.giro || "";
      form.street = data.street;
      form.number = data.number;
      form.comuna = data.comuna;
      form.region = data.region;
      // Resolve region → load comunas
      const region = regions.value.find((r) => r.name === data.region);
      if (region) {
        selectedRegionId.value = region.id;
      }
    }
  } catch {
    // no billing profile yet
  }
}

async function save() {
  saving.value = true;
  message.value = "";
  try {
    const body = { ...form, giro: form.giro || undefined };
    if (existing.value) {
      await api("/account/billing", { method: "PUT", body });
    } else {
      await api("/account/billing", { method: "POST", body });
    }
    await load();
    message.value = "Datos de facturación guardados";
    messageError.value = false;
  } catch (e: any) {
    message.value = e.data?.detail || "Error al guardar";
    messageError.value = true;
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  regions.value = await api<Region[]>("/geography/regions").catch(() => []);
  await load();
});

useHead({ title: "Facturación - ByteDigital" });
</script>
