<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
        <p class="text-gray-500 mt-2">Te enviaremos un código a tu correo</p>
      </div>

      <div class="bg-white border rounded-xl p-6 shadow-sm">
        <div v-if="sent" class="text-center py-4">
          <Mail class="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Revisa tu correo</h2>
          <p class="text-gray-500 text-sm mb-6">
            Si el correo está registrado, recibirás un código de 6 dígitos.
          </p>
          <NuxtLink
            :to="`/recuperar-clave?email=${encodeURIComponent(form.email)}`"
            class="block w-full bg-primary-600 text-white rounded-lg py-2.5 font-semibold hover:bg-primary-700 transition-colors text-center"
          >
            Ya tengo el código
          </NuxtLink>
          <NuxtLink to="/login" class="block mt-3 text-sm text-gray-500 hover:text-gray-700">
            Volver al login
          </NuxtLink>
        </div>

        <form v-else class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 text-white rounded-lg py-2.5 font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? "Enviando..." : "Enviar código" }}
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
import { Mail } from "lucide-vue-next";

const { api } = useApi();
const loading = ref(false);
const sent = ref(false);
const form = reactive({ email: "" });

async function handleSubmit() {
  loading.value = true;
  try {
    await api("/customer-auth/forgot-password", {
      method: "POST",
      body: { email: form.email },
    });
    sent.value = true;
  } finally {
    loading.value = false;
  }
}

useHead({ title: "Recuperar contraseña - ByteDigital" });
</script>
