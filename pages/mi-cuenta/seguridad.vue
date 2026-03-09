<template>
  <div>
    <h2 class="text-xl font-bold mb-6">Seguridad</h2>

    <!-- Change password -->
    <div class="max-w-md">
      <h3 class="font-semibold mb-4">Cambiar contraseña</h3>
      <form class="space-y-4" @submit.prevent="changePassword">
        <div v-if="!user?.google_linked || user?.google_linked">
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
          <input
            v-model="form.current_password"
            type="password"
            class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p class="text-xs text-gray-400 mt-1">Déjalo vacío si solo tienes cuenta Google</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
          <input
            v-model="form.new_password"
            type="password"
            required
            minlength="8"
            class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <p v-if="message" class="text-sm" :class="messageError ? 'text-red-500' : 'text-green-600'">{{ message }}</p>
        <button
          type="submit"
          :disabled="saving"
          class="bg-primary-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          {{ saving ? "Actualizando..." : "Actualizar contraseña" }}
        </button>
      </form>

      <!-- Linked accounts -->
      <div class="mt-10 pt-6 border-t">
        <h3 class="font-semibold mb-4">Cuentas vinculadas</h3>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600">Google</span>
          <span
            v-if="user?.google_linked"
            class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium"
          >
            Vinculada
          </span>
          <span
            v-else
            class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium"
          >
            No vinculada
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
const { api } = useApi();

const form = reactive({
  current_password: "",
  new_password: "",
});
const confirmPassword = ref("");
const saving = ref(false);
const message = ref("");
const messageError = ref(false);

async function changePassword() {
  message.value = "";
  if (form.new_password !== confirmPassword.value) {
    message.value = "Las contraseñas no coinciden";
    messageError.value = true;
    return;
  }
  saving.value = true;
  try {
    await api("/customer-auth/me/password", {
      method: "PUT",
      body: {
        current_password: form.current_password || undefined,
        new_password: form.new_password,
      },
    });
    message.value = "Contraseña actualizada correctamente";
    messageError.value = false;
    form.current_password = "";
    form.new_password = "";
    confirmPassword.value = "";
  } catch (e: any) {
    message.value = e.data?.detail || "Error al cambiar contraseña";
    messageError.value = true;
  } finally {
    saving.value = false;
  }
}

useHead({ title: "Seguridad - ByteDigital" });
</script>
