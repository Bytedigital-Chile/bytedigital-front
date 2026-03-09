<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md text-center">
      <div v-if="!errorMsg" class="space-y-4">
        <Loader2 class="w-8 h-8 text-primary-600 animate-spin mx-auto" />
        <p class="text-gray-500">Verificando tu email...</p>
      </div>
      <div v-else class="space-y-4">
        <AlertCircle class="w-12 h-12 text-red-500 mx-auto" />
        <h2 class="text-lg font-semibold text-gray-900">Error de verificación</h2>
        <p class="text-gray-500 text-sm">{{ errorMsg }}</p>
        <NuxtLink
          to="/login"
          class="inline-block mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Ir al inicio de sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, AlertCircle } from "lucide-vue-next";

const route = useRoute();
const config = useRuntimeConfig();
const errorMsg = ref("");

onMounted(() => {
  const token = route.query.token as string;
  if (!token) {
    errorMsg.value = "No se encontró el token de verificación. Verifica que el enlace sea correcto.";
    return;
  }

  const apiBase = config.public.apiBase || "http://localhost:8000";
  window.location.href = `${apiBase}/customer-auth/verify-email?token=${encodeURIComponent(token)}`;
});

useHead({ title: "Verificando email - ByteDigital" });
</script>
