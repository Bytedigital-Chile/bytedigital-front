<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <div v-if="pending" class="text-center py-20">
      <p class="text-gray-500">Cargando tu pedido...</p>
    </div>

    <div v-else-if="!order" class="text-center py-20">
      <p class="text-red-500">No encontramos el pedido.</p>
      <NuxtLink to="/mi-cuenta/compras" class="text-primary-600 hover:underline text-sm mt-2 inline-block">
        Ver mis compras
      </NuxtLink>
    </div>

    <div v-else>
      <div class="text-center mb-8">
        <div class="text-6xl mb-3">✓</div>
        <h1 class="text-3xl font-bold">Pedido #{{ order.order_number }} recibido</h1>
        <p class="text-gray-600 mt-2">
          Completa tu compra enviando el monto total a los siguientes datos:
        </p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 class="font-semibold mb-3">Datos para transferencia</h2>
        <div v-if="bankInfoLines.length" class="space-y-1 font-mono text-sm">
          <p v-for="(line, idx) in bankInfoLines" :key="idx">{{ line }}</p>
        </div>
        <p v-else class="text-sm text-red-600">
          Los datos bancarios no están configurados. Contacta con soporte.
        </p>

        <div class="border-t border-gray-200 mt-4 pt-4 space-y-1">
          <p>
            Monto: <strong class="text-xl">{{ formatCLP(order.total) }}</strong>
          </p>
          <p>
            Referencia: <strong>{{ order.order_number }}</strong>
            <span class="text-xs text-gray-500 ml-2">
              (Inclúyela en el comentario de la transferencia)
            </span>
          </p>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm mb-6">
        <p class="mb-1 font-medium">¿Qué sigue?</p>
        <p class="text-gray-700">
          Te enviaremos un email con la confirmación del pago en cuanto lo recibamos
          y procesemos tu pedido. También puedes revisar el estado en
          <strong>Mis Compras</strong>.
        </p>
      </div>

      <div class="flex gap-3">
        <NuxtLink
          to="/mi-cuenta/compras"
          class="flex-1 text-center border border-gray-300 rounded-lg py-3 hover:bg-gray-50 font-medium"
        >
          Ir a mis compras
        </NuxtLink>
        <NuxtLink
          to="/"
          class="flex-1 text-center bg-primary-600 text-white rounded-lg py-3 font-medium hover:bg-primary-700"
        >
          Seguir comprando
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCLP } from "~/utils/format";

definePageMeta({ middleware: "auth" });

interface OrderDetail {
  id: number;
  order_number: string;
  status: string;
  total: number;
  payment_method_type: string | null;
  bank_transfer_info: Record<string, string> | null;
}

const route = useRoute();
const { api } = useApi();

const pending = ref(true);
const order = ref<OrderDetail | null>(null);

const bankInfoLines = computed<string[]>(() => {
  const info = order.value?.bank_transfer_info;
  if (!info) return [];
  return Object.entries(info).map(([k, v]) => {
    const label = k
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return `${label}: ${v}`;
  });
});

onMounted(async () => {
  try {
    order.value = await api<OrderDetail>(
      `/account/orders/${route.params.orderNumber}`,
    );
  } catch {
    order.value = null;
  } finally {
    pending.value = false;
  }
});

useHead({ title: "Confirmación de transferencia - ByteDigital" });
</script>
