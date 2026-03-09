<template>
  <div class="max-w-lg mx-auto px-4 py-16 text-center">
    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertTriangle class="w-8 h-8 text-red-600" />
    </div>
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Error en el pago</h1>
    <p class="text-gray-600 mb-8">Ocurrió un error al procesar tu pago. Por favor intenta nuevamente.</p>
    <div class="flex gap-4 justify-center">
      <NuxtLink
        to="/carrito"
        class="border border-gray-300 rounded-lg px-6 py-2.5 hover:bg-gray-50"
      >
        Volver al carrito
      </NuxtLink>
      <NuxtLink
        to="/"
        class="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700"
      >
        Ir al inicio
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";

useHead({ title: "Error de pago - ByteDigital" });
</script>
