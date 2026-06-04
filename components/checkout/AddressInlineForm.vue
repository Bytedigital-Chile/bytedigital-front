<template>
  <div class="space-y-3">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        v-model="model.email"
        type="email"
        required
        placeholder="tu@email.com"
        class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <p class="text-xs text-gray-400 mt-1">Te enviaremos el número de pedido a este correo.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de quien recibe</label>
      <input
        v-model="model.name"
        type="text"
        required
        class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Región</label>
        <select
          v-model="selectedRegionId"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option :value="null" disabled>Selecciona región</option>
          <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
        <select
          v-model="model.comuna_id"
          required
          :disabled="!selectedRegionId"
          class="w-full border rounded-lg px-3 py-2 text-sm bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option :value="null" disabled>Selecciona comuna</option>
          <option v-for="c in comunas" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Calle</label>
        <input v-model="model.street" type="text" required class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
        <input v-model="model.number" type="text" required class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Depto / Casa (opcional)</label>
        <input v-model="model.apartment" type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input v-model="model.phone" type="tel" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface GuestForm {
  email: string;
  name: string;
  street: string;
  number: string;
  apartment: string;
  region: string;
  comuna_id: number | null;
  phone: string;
}

interface Region { id: number; name: string }
interface ComunaOption { id: number; name: string }

const model = defineModel<GuestForm>({ required: true });

const { api } = useApi();
const regions = ref<Region[]>([]);
const comunas = ref<ComunaOption[]>([]);
const selectedRegionId = ref<number | null>(null);

watch(selectedRegionId, async (regionId) => {
  comunas.value = [];
  model.value.comuna_id = null;
  if (!regionId) {
    model.value.region = "";
    return;
  }
  const region = regions.value.find((r) => r.id === regionId);
  model.value.region = region?.name || "";
  comunas.value = await api<ComunaOption[]>(`/geography/regions/${regionId}/comunas`).catch(() => []);
});

onMounted(async () => {
  regions.value = await api<Region[]>("/geography/regions").catch(() => []);
});
</script>
