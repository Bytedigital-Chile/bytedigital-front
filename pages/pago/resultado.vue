<template>
  <div class="max-w-lg mx-auto px-4 py-16 text-center">
    <!-- Loading -->
    <div v-if="polling" class="space-y-4">
      <div class="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p class="text-lg font-medium text-gray-700">Procesando tu pago...</p>
      <p class="text-sm text-gray-500">Esto puede tomar unos segundos</p>
    </div>

    <!-- Success -->
    <div v-else-if="status === 'paid'" class="space-y-4">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check class="w-8 h-8 text-green-600" />
      </div>
      <h1 class="text-2xl font-bold text-green-700">Pago exitoso</h1>
      <p class="text-gray-600">Tu orden ha sido confirmada</p>
      <NuxtLink
        v-if="orderNumber"
        :to="`/mi-cuenta/compras/${orderNumber}`"
        class="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 mt-4"
      >
        Ver mi orden
      </NuxtLink>
    </div>

    <!-- Failed -->
    <div v-else class="space-y-4">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <X class="w-8 h-8 text-red-600" />
      </div>
      <h1 class="text-2xl font-bold text-red-700">Pago no completado</h1>
      <p class="text-gray-600">Tu pago fue rechazado o cancelado</p>
      <div class="flex gap-4 justify-center mt-4">
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
          Seguir comprando
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, X } from "lucide-vue-next";

const route = useRoute();
const { api } = useApi();

const orderNumber = ref(route.query.order as string || "");
const status = ref("");
const polling = ref(true);

onMounted(async () => {
  if (!orderNumber.value) {
    polling.value = false;
    status.value = "failed";
    return;
  }

  // Poll for payment status
  const maxAttempts = 15;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const data = await api<{ status: string }>(`/payments/status/${orderNumber.value}`);
      if (data.status === "paid") {
        status.value = "paid";
        polling.value = false;
        return;
      }
      if (data.status === "cancelled" || data.status === "refunded") {
        status.value = "failed";
        polling.value = false;
        return;
      }
    } catch {
      // continue polling
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Timeout - check one last time
  try {
    const data = await api<{ status: string }>(`/payments/status/${orderNumber.value}`);
    status.value = data.status === "paid" ? "paid" : "failed";
  } catch {
    status.value = "failed";
  }
  polling.value = false;
});

useHead({ title: "Resultado del pago - ByteDigital" });
</script>
