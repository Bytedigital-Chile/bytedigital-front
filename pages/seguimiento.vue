<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold mb-2">Seguir mi pedido</h1>
    <p class="text-gray-500 text-sm mb-6">
      Ingresa el <strong>código de seguimiento</strong> que te enviamos por correo y tu email.
    </p>

    <form class="bg-white border rounded-xl p-5 shadow-sm space-y-4" @submit.prevent="track">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Código de seguimiento</label>
        <input
          v-model="code"
          type="text"
          required
          placeholder="XXXX-XXXX"
          class="w-full border rounded-lg px-3 py-2.5 text-sm uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="tu@email.com"
          class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-primary-600 text-white rounded-lg py-2.5 font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {{ loading ? "Buscando..." : "Ver mi pedido" }}
      </button>
      <div class="text-center pt-1">
        <button
          type="button"
          :disabled="resending || !email"
          class="text-sm text-gray-500 hover:text-primary-600 disabled:opacity-50"
          @click="resend"
        >
          ¿No encuentras tu código? Reenviármelo a mi correo
        </button>
        <p v-if="resendMsg" class="text-green-600 text-xs mt-1">{{ resendMsg }}</p>
      </div>
    </form>

    <!-- Order detail -->
    <div v-if="order" class="mt-8 bg-white border rounded-xl p-5 shadow-sm">
      <div class="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 class="text-lg font-bold">Pedido #{{ order.order_number }}</h2>
        <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', statusClass]">{{ statusLabel }}</span>
      </div>

      <div class="border rounded-lg overflow-hidden mb-4">
        <div
          v-for="it in order.items"
          :key="it.id"
          class="flex items-center gap-4 p-3 border-b last:border-0"
        >
          <img v-if="it.product_image_url" :src="it.product_image_url" class="w-12 h-12 object-contain rounded" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ it.product_name }}</p>
            <p class="text-xs text-gray-500">x{{ it.quantity }}</p>
          </div>
          <p class="text-sm font-semibold">{{ formatCLP(it.total_price) }}</p>
        </div>
      </div>

      <div class="space-y-1 text-sm">
        <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>{{ formatCLP(order.subtotal) }}</span></div>
        <div class="flex justify-between text-gray-600"><span>Envío</span><span>{{ formatCLP(order.shipping_cost) }}</span></div>
        <div class="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span class="text-primary-600">{{ formatCLP(order.total) }}</span></div>
      </div>

      <div class="mt-4 text-sm text-gray-600">
        <p class="font-medium text-gray-700">Envío a:</p>
        <p>{{ order.shipping_name }}</p>
        <p>{{ order.shipping_street }} {{ order.shipping_number }}{{ order.shipping_apartment ? `, ${order.shipping_apartment}` : "" }}</p>
        <p>{{ order.shipping_city }}, {{ order.shipping_region }}</p>
      </div>

      <!-- Bank info for a pending transfer -->
      <div v-if="bankLines.length" class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
        <p class="font-medium mb-1">Datos para transferir (monto: {{ formatCLP(order.total) }})</p>
        <p v-for="(line, i) in bankLines" :key="i" class="text-gray-700">{{ line }}</p>
        <p class="text-gray-600 mt-2">Referencia: <strong>{{ order.order_number }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCLP } from "~/utils/format";

interface OrderDetail {
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method_type: string | null;
  bank_transfer_info: Record<string, string> | null;
  shipping_name: string;
  shipping_street: string;
  shipping_number: string;
  shipping_apartment: string | null;
  shipping_city: string;
  shipping_region: string;
  items: { id: number; product_name: string; product_image_url: string | null; quantity: number; total_price: number }[];
}

const { api } = useApi();
const route = useRoute();

const code = ref((route.query.codigo as string) || "");
const email = ref((route.query.email as string) || "");
const loading = ref(false);
const error = ref("");
const order = ref<OrderDetail | null>(null);
const resending = ref(false);
const resendMsg = ref("");

async function resend() {
  if (!email.value) return;
  resending.value = true;
  resendMsg.value = "";
  try {
    await api("/account/orders/resend-code", { method: "POST", body: { email: email.value } });
  } catch {
    // ignore — response is generic anyway
  } finally {
    resending.value = false;
    resendMsg.value = "Si hay un pedido con ese correo, te reenviamos el código.";
  }
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending_payment: { label: "Pendiente de pago", cls: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Pagado", cls: "bg-green-100 text-green-700" },
  processing: { label: "En preparación", cls: "bg-blue-100 text-blue-700" },
  shipped: { label: "Enviado", cls: "bg-blue-100 text-blue-700" },
  delivered: { label: "Entregado", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado", cls: "bg-red-100 text-red-700" },
  refunded: { label: "Reembolsado", cls: "bg-gray-100 text-gray-700" },
};
const statusLabel = computed(() => STATUS[order.value?.status || ""]?.label || order.value?.status || "");
const statusClass = computed(() => STATUS[order.value?.status || ""]?.cls || "bg-gray-100 text-gray-700");

const bankLines = computed<string[]>(() => {
  const info = order.value?.bank_transfer_info;
  if (!info) return [];
  return Object.entries(info).map(([k, v]) => {
    const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `${label}: ${v}`;
  });
});

async function track() {
  if (!code.value || !email.value) return;
  loading.value = true;
  error.value = "";
  order.value = null;
  try {
    order.value = await api<OrderDetail>("/account/orders/track", {
      method: "POST",
      body: { code: code.value, email: email.value },
    });
  } catch {
    error.value = "No encontramos un pedido con esos datos. Revisa el código y el correo.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // One-click from the email link (?codigo=&email=) auto-fetches.
  if (code.value && email.value) track();
});

useHead({ title: "Seguir mi pedido - ByteDigital" });
</script>
