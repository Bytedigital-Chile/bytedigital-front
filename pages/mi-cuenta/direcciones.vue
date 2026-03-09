<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">Direcciones</h2>
      <button
        class="bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary-700"
        @click="openForm()"
      >
        Agregar dirección
      </button>
    </div>

    <!-- Address cards -->
    <div v-if="addresses.length === 0" class="text-center py-12 text-gray-500">
      <p>No tienes direcciones guardadas</p>
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="addr in addresses"
        :key="addr.id"
        class="border rounded-xl p-4 flex justify-between items-start"
      >
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold">{{ addr.label }}</span>
            <span
              v-if="addr.is_default"
              class="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium"
            >
              Principal
            </span>
          </div>
          <p class="text-sm text-gray-600">
            {{ addr.street }} {{ addr.number }}{{ addr.apartment ? `, Depto ${addr.apartment}` : "" }}
          </p>
          <p class="text-sm text-gray-600">{{ addr.comuna }}, {{ addr.region }}</p>
          <p v-if="addr.recipient_name" class="text-xs text-gray-400 mt-1">{{ addr.recipient_name }}</p>
        </div>
        <div class="flex gap-2">
          <button class="text-sm text-primary-600 hover:underline" @click="openForm(addr)">Editar</button>
          <button class="text-sm text-red-500 hover:underline" @click="deleteAddress(addr.id)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4">{{ editing ? "Editar dirección" : "Agregar dirección" }}</h3>
        <form class="space-y-3" @submit.prevent="saveAddress">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
            <input v-model="form.label" type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Casa, Oficina..." />
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Calle</label>
              <input v-model="form.street" type="text" required class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input v-model="form.number" type="text" required class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Depto/Oficina (opcional)</label>
            <input v-model="form.apartment" type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Región</label>
              <select v-model="selectedRegionId" required class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                <option value="" disabled>Selecciona región</option>
                <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
              <select v-model="form.comuna" required :disabled="!selectedRegionId" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-gray-100">
                <option value="" disabled>Selecciona comuna</option>
                <option v-for="c in comunas" :key="c.id" :value="c.name">{{ c.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del destinatario (opcional)</label>
            <input v-model="form.recipient_name" type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.is_default" type="checkbox" class="rounded" />
            Dirección principal
          </label>
          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 border rounded-lg py-2 text-sm font-medium hover:bg-gray-50" @click="showForm = false">Cancelar</button>
            <button type="submit" :disabled="saving" class="flex-1 bg-primary-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-primary-700 disabled:opacity-50">
              {{ saving ? "Guardando..." : "Guardar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomerAddress, Region, ComunaOption } from "~/types";

const { api } = useApi();

const addresses = ref<CustomerAddress[]>([]);
const showForm = ref(false);
const editing = ref<number | null>(null);
const saving = ref(false);

// Geography data
const regions = ref<Region[]>([]);
const comunas = ref<ComunaOption[]>([]);
const selectedRegionId = ref<number | string>("");

const form = reactive({
  label: "Casa",
  street: "",
  number: "",
  apartment: "",
  comuna: "",
  region: "",
  recipient_name: "",
  is_default: false,
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
  // Reset comuna only if it's not in the new list (allows edit mode to keep value)
  if (!comunas.value.some((c) => c.name === form.comuna)) {
    form.comuna = "";
  }
});

function resetForm() {
  form.label = "Casa";
  form.street = "";
  form.number = "";
  form.apartment = "";
  form.comuna = "";
  form.region = "";
  form.recipient_name = "";
  form.is_default = false;
  selectedRegionId.value = "";
  comunas.value = [];
}

async function openForm(addr?: CustomerAddress) {
  if (addr) {
    editing.value = addr.id;
    form.label = addr.label;
    form.street = addr.street;
    form.number = addr.number;
    form.apartment = addr.apartment || "";
    form.comuna = addr.comuna;
    form.region = addr.region;
    form.recipient_name = addr.recipient_name || "";
    form.is_default = addr.is_default;
    // Resolve region → load comunas
    const region = regions.value.find((r) => r.name === addr.region);
    if (region) {
      selectedRegionId.value = region.id;
    }
  } else {
    editing.value = null;
    resetForm();
  }
  showForm.value = true;
}

async function fetchAddresses() {
  addresses.value = await api<CustomerAddress[]>("/account/addresses");
}

async function saveAddress() {
  saving.value = true;
  try {
    const body = { ...form, apartment: form.apartment || undefined, recipient_name: form.recipient_name || undefined };
    if (editing.value) {
      await api(`/account/addresses/${editing.value}`, { method: "PUT", body });
    } else {
      await api("/account/addresses", { method: "POST", body });
    }
    showForm.value = false;
    await fetchAddresses();
  } catch {
    // silently handle
  } finally {
    saving.value = false;
  }
}

async function deleteAddress(id: number) {
  if (!confirm("¿Eliminar esta dirección?")) return;
  await api(`/account/addresses/${id}`, { method: "DELETE" });
  await fetchAddresses();
}

onMounted(async () => {
  regions.value = await api<Region[]>("/geography/regions").catch(() => []);
  await fetchAddresses();
});

useHead({ title: "Direcciones - ByteDigital" });
</script>
