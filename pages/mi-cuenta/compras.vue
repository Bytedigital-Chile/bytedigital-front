<template>
  <div>
    <h2 class="text-xl font-bold mb-6">Mis compras</h2>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 rounded-lg animate-pulse" />
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-12 text-gray-500">
      <ShoppingBag class="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p class="text-lg mb-2">No tienes compras aún</p>
      <NuxtLink to="/" class="text-primary-600 hover:underline">Explorar productos</NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <NuxtLink
        v-for="order in orders"
        :key="order.id"
        :to="`/mi-cuenta/compras/${order.order_number}`"
        class="block border rounded-xl p-4 hover:border-primary-300 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold">{{ order.order_number }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }} · {{ order.item_count }} producto{{ order.item_count > 1 ? "s" : "" }}</p>
          </div>
          <div class="text-right">
            <span
              class="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
              :class="statusClass(order.status)"
            >
              {{ statusLabel(order.status) }}
            </span>
            <p class="font-bold text-primary-600 mt-1">{{ formatCLP(order.total) }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag } from "lucide-vue-next";
import type { Order } from "~/types";
import { formatCLP } from "~/utils/format";

const { api } = useApi();

const orders = ref<any[]>([]);
const loading = ref(true);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
    orders.value = await api<any[]>("/account/orders/");
  } catch {
    orders.value = [];
  } finally {
    loading.value = false;
  }
});

useHead({ title: "Mis compras - ByteDigital" });
</script>
