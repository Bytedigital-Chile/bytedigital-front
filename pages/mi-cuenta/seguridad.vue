<template>
  <div>
    <h2 class="text-xl font-bold mb-6">Seguridad</h2>

    <!-- Change password -->
    <div class="max-w-md">
      <h3 class="font-semibold mb-4">Cambiar contraseña</h3>
      <form class="space-y-4" @submit.prevent="changePassword">
        <div v-if="user?.hashed_password_set ?? true">
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
        <div class="border rounded-lg p-4">
          <div class="flex items-center gap-3 mb-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.98 10.98 0 0 0 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09 0-.73.13-1.43.35-2.09V7.07H2.18A10.98 10.98 0 0 0 1 12c0 1.77.42 3.44 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div class="flex-1">
              <p class="font-medium text-sm">Google</p>
              <p v-if="user?.google_linked" class="text-xs text-gray-500">
                Puedes iniciar sesión con tu cuenta Google.
              </p>
              <p v-else class="text-xs text-gray-500">
                Conecta tu cuenta Google para iniciar sesión con un click.
              </p>
            </div>
            <span
              v-if="user?.google_linked"
              class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium"
            >
              Vinculada
            </span>
          </div>

          <div v-if="user?.google_linked" class="flex justify-end">
            <button
              type="button"
              :disabled="unlinkLoading"
              class="text-sm text-red-600 hover:underline disabled:opacity-50"
              @click="unlinkGoogle"
            >
              {{ unlinkLoading ? "Desvinculando..." : "Desvincular" }}
            </button>
          </div>
          <div v-else>
            <div id="google-link-button" class="flex justify-end"></div>
            <p v-if="!googleClientId" class="text-xs text-gray-400 mt-2">
              Login con Google no configurado.
            </p>
          </div>

          <p v-if="linkMessage" class="text-sm mt-3" :class="linkError ? 'text-red-500' : 'text-green-600'">
            {{ linkMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuth();
const { api } = useApi();
const config = useRuntimeConfig();
const googleClientId = config.public.googleClientId as string;

const form = reactive({
  current_password: "",
  new_password: "",
});
const confirmPassword = ref("");
const saving = ref(false);
const message = ref("");
const messageError = ref(false);

const unlinkLoading = ref(false);
const linkMessage = ref("");
const linkError = ref(false);

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

async function linkWithCredential(credential: string) {
  linkMessage.value = "";
  linkError.value = false;
  try {
    await api("/customer-auth/me/link-google", {
      method: "POST",
      body: { credential },
    });
    linkMessage.value = "Cuenta Google vinculada correctamente.";
    await fetchUser();
  } catch (e: any) {
    linkMessage.value = e.data?.detail || "Error al vincular Google.";
    linkError.value = true;
  }
}

async function unlinkGoogle() {
  if (!confirm("¿Desvincular tu cuenta Google? Después solo podrás iniciar sesión con email y contraseña.")) return;
  unlinkLoading.value = true;
  linkMessage.value = "";
  linkError.value = false;
  try {
    await api("/customer-auth/me/unlink-google", { method: "POST" });
    linkMessage.value = "Cuenta Google desvinculada.";
    await fetchUser();
  } catch (e: any) {
    linkMessage.value = e.data?.detail || "Error al desvincular.";
    linkError.value = true;
  } finally {
    unlinkLoading.value = false;
  }
}

function renderGoogleButton() {
  if (!googleClientId) return;
  if (user.value?.google_linked) return;
  const container = document.getElementById("google-link-button");
  if (!container) return;
  const g = (window as any).google;
  if (!g?.accounts) return;
  g.accounts.id.initialize({
    client_id: googleClientId,
    callback: (response: any) => linkWithCredential(response.credential),
  });
  container.innerHTML = "";
  g.accounts.id.renderButton(container, {
    theme: "outline",
    size: "medium",
    text: "continue_with",
    locale: "es",
  });
}

onMounted(() => {
  if (!googleClientId) return;
  if ((window as any).google?.accounts) {
    renderGoogleButton();
  } else {
    const t = setInterval(() => {
      if ((window as any).google?.accounts) {
        clearInterval(t);
        renderGoogleButton();
      }
    }, 200);
    setTimeout(() => clearInterval(t), 8000);
  }
});

// Re-render if user unlinks and comes back
watch(() => user.value?.google_linked, (linked) => {
  if (linked === false) nextTick(() => renderGoogleButton());
});

useHead({ title: "Seguridad - ByteDigital" });
</script>
