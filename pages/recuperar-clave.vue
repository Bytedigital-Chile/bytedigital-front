<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Nueva contraseña</h1>
        <p class="text-gray-500 mt-2">Ingresa el código que te enviamos</p>
      </div>

      <div class="bg-white border rounded-xl p-6 shadow-sm">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código de 6 dígitos</label>
            <input
              v-model="form.code"
              required
              maxlength="6"
              class="w-full border rounded-lg px-3 py-2.5 text-center text-lg tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="000000"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <input
              v-model="form.new_password"
              type="password"
              required
              minlength="8"
              class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input
              v-model="form.confirm"
              type="password"
              required
              class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 text-white rounded-lg py-2.5 font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? "Restableciendo..." : "Restablecer contraseña" }}
          </button>
          <p class="text-center text-sm">
            <NuxtLink to="/login" class="text-primary-600 hover:underline">Volver al login</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { api } = useApi();
const route = useRoute();
const customerToken = useCookie("customer_token", { maxAge: 60 * 60 * 8 });
const { fetchUser } = useAuth();

const loading = ref(false);
const error = ref("");
const form = reactive({
  email: (route.query.email as string) || "",
  code: "",
  new_password: "",
  confirm: "",
});

async function handleSubmit() {
  if (form.new_password !== form.confirm) {
    error.value = "Las contraseñas no coinciden";
    return;
  }
  loading.value = true;
  error.value = "";
  try {
    const data = await api<{ access_token: string }>("/customer-auth/reset-password", {
      method: "POST",
      body: {
        email: form.email,
        code: form.code,
        new_password: form.new_password,
      },
    });
    customerToken.value = data.access_token;
    await fetchUser();
    navigateTo("/mi-cuenta");
  } catch (e: any) {
    error.value = e.data?.detail || "Código inválido o expirado";
  } finally {
    loading.value = false;
  }
}

useHead({ title: "Restablecer contraseña - ByteDigital" });
</script>
