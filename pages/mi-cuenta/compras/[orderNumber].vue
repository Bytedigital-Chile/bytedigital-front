<template>
  <div>
    <NuxtLink to="/mi-cuenta/compras" class="text-sm text-primary-600 hover:underline mb-4 inline-block">
      &larr; Volver a compras
    </NuxtLink>

    <div v-if="!order" class="text-center py-12 text-gray-500">
      <p>Cargando orden...</p>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Orden {{ order.order_number }}</h2>
        <span
          class="text-xs font-semibold px-3 py-1 rounded-full"
          :class="statusClass(order.status)"
        >
          {{ statusLabel(order.status) }}
        </span>
      </div>

      <!-- Items -->
      <div class="border rounded-xl overflow-hidden mb-6">
        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex items-center gap-4 p-4 border-b last:border-0"
        >
          <img
            v-if="item.product_image_url"
            :src="item.product_image_url"
            :alt="item.product_name"
            class="w-16 h-16 object-contain rounded"
          />
          <div class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-300" v-else>
            <span class="text-xs">Sin img</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm">{{ item.product_name }}</p>
            <p class="text-xs text-gray-500">Cantidad: {{ item.quantity }}</p>
          </div>
          <p class="font-semibold text-sm">{{ formatCLP(item.total_price) }}</p>
        </div>
      </div>

      <!-- Totals -->
      <div class="border rounded-xl p-4 space-y-2 mb-6">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal</span>
          <span>{{ formatCLP(order.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Envío</span>
          <span>{{ order.shipping_cost === 0 ? "Gratis" : formatCLP(order.shipping_cost) }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span class="text-primary-600">{{ formatCLP(order.total) }}</span>
        </div>
      </div>

      <!-- Shipping address -->
      <div class="border rounded-xl p-4">
        <h3 class="font-semibold mb-2 text-sm">Dirección de envío</h3>
        <p class="text-sm text-gray-600">{{ order.shipping_name }}</p>
        <p class="text-sm text-gray-600">
          {{ order.shipping_street }} {{ order.shipping_number }}{{ order.shipping_apartment ? `, Depto ${order.shipping_apartment}` : "" }}
        </p>
        <p class="text-sm text-gray-600">{{ order.shipping_city }}, {{ order.shipping_region }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "~/types";
import { formatCLP } from "~/utils/format";

const route = useRoute();
const { api } = useApi();

const order = ref<Order | null>(null);

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending_payment: "Pendiente de pago",
    paid: "Pagado",
    processing: "En proceso",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
  };
  return map[status] || status;
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };
  return map[status] || "bg-gray-100 text-gray-600";
}

onMounted(async () => {
  try {
    order.value = await api<Order>(`/account/orders/${route.params.orderNumber}`);
  } catch {
    // handle error
  }
});

useHead(() => ({
  title: order.value ? `Orden ${order.value.order_number} - ByteDigital` : "Orden - ByteDigital",
}));
</script>
