<template>
  <div>
    <h2 class="text-xl font-bold mb-6">Datos personales</h2>
    <form class="space-y-4 max-w-md" @submit.prevent="save">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          v-model="form.first_name"
          type="text"
          class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
        <input
          v-model="form.last_name"
          type="text"
          class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="+56 9 1234 5678"
        />
      </div>
      <p v-if="message" class="text-sm" :class="messageError ? 'text-red-500' : 'text-green-600'">{{ message }}</p>
      <button
        type="submit"
        :disabled="saving"
        class="bg-primary-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {{ saving ? "Guardando..." : "Guardar cambios" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuth();
const { api } = useApi();

const form = reactive({
  first_name: user.value?.first_name || "",
  last_name: user.value?.last_name || "",
  phone: user.value?.phone || "",
});

const saving = ref(false);
const message = ref("");
const messageError = ref(false);

watch(user, (u) => {
  if (u) {
    form.first_name = u.first_name;
    form.last_name = u.last_name;
    form.phone = u.phone || "";
  }
}, { immediate: true });

async function save() {
  saving.value = true;
  message.value = "";
  try {
    await api("/customer-auth/me", { method: "PUT", body: form });
    await fetchUser();
    message.value = "Datos actualizados correctamente";
    messageError.value = false;
  } catch (e: any) {
    message.value = e.data?.detail || "Error al guardar";
    messageError.value = true;
  } finally {
    saving.value = false;
  }
}

useHead({ title: "Datos personales - ByteDigital" });
</script>
