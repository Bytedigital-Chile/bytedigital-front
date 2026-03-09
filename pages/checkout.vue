<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>

    <!-- Step 1: Select address -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">1. Dirección de envío</h2>
      <div v-if="addresses.length === 0" class="border rounded-lg p-4 text-center text-gray-500">
        <p class="mb-2">No tienes direcciones guardadas</p>
        <NuxtLink to="/mi-cuenta/direcciones" class="text-primary-600 hover:underline text-sm">
          Agregar una dirección
        </NuxtLink>
      </div>
      <div v-else class="space-y-3">
        <label
          v-for="addr in addresses"
          :key="addr.id"
          class="flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-colors"
          :class="selectedAddressId === addr.id ? 'border-primary-500 bg-primary-50' : 'hover:border-gray-300'"
        >
          <input
            v-model="selectedAddressId"
            type="radio"
            :value="addr.id"
            class="mt-1"
          />
          <div>
            <p class="font-medium">{{ addr.label }}</p>
            <p class="text-sm text-gray-600">
              {{ addr.street }} {{ addr.number }}{{ addr.apartment ? `, Depto ${addr.apartment}` : "" }}
            </p>
            <p class="text-sm text-gray-600">{{ addr.comuna }}, {{ addr.region }}</p>
          </div>
        </label>
      </div>
    </div>

    <!-- Step 2: Order summary -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">2. Resumen del pedido</h2>
      <div class="border rounded-lg overflow-hidden">
        <div
          v-for="item in cartItems"
          :key="item.product.id"
          class="flex items-center gap-4 p-4 border-b last:border-0"
        >
          <img
            v-if="item.product.images?.[0]"
            :src="item.product.images[0].url"
            class="w-12 h-12 object-contain rounded"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ item.product.name }}</p>
            <p class="text-xs text-gray-500">x{{ item.quantity }}</p>
          </div>
          <p class="text-sm font-semibold">
            {{ formatCLP((item.unit_price || item.product.sale_price || item.product.base_price) * item.quantity) }}
          </p>
        </div>
      </div>
      <div class="mt-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal</span>
          <span>{{ formatCLP(cartTotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Envío</span>
          <span :class="cartTotal >= 50000 ? 'text-green-600' : ''">
            {{ cartTotal >= 50000 ? "Gratis" : formatCLP(3990) }}
          </span>
        </div>
        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span class="text-primary-600">
            {{ formatCLP(cartTotal + (cartTotal >= 50000 ? 0 : 3990)) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Step 3: Payment -->
    <div>
      <h2 class="text-lg font-semibold mb-4">3. Pagar</h2>

      <div v-if="gateways.length === 0 && !loadingGateways" class="border rounded-lg p-4 text-center text-gray-500">
        <p>No hay métodos de pago disponibles en este momento</p>
      </div>

      <div v-else class="space-y-3">
        <button
          v-for="gw in gateways"
          :key="gw.slug"
          class="w-full border-2 rounded-lg p-4 text-left font-semibold hover:border-primary-500 transition-colors disabled:opacity-50"
          :disabled="processing"
          @click="pay(gw.slug)"
        >
          {{ gw.name }}
        </button>
      </div>

      <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
      <p v-if="processing" class="text-sm text-gray-500 mt-4">Procesando tu pedido...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomerAddress, PaymentGatewayPublic } from "~/types";
import { formatCLP } from "~/utils/format";

definePageMeta({ middleware: "auth" });

const { api } = useApi();
const { items: cartItems, cartTotal } = useCart();

const addresses = ref<CustomerAddress[]>([]);
const selectedAddressId = ref<number | null>(null);
const gateways = ref<PaymentGatewayPublic[]>([]);
const loadingGateways = ref(true);
const processing = ref(false);
const error = ref("");

onMounted(async () => {
  const [addrs, gws] = await Promise.all([
    api<CustomerAddress[]>("/account/addresses").catch(() => []),
    api<PaymentGatewayPublic[]>("/payment-gateways/active").catch(() => []),
  ]);
  addresses.value = addrs;
  gateways.value = gws;
  loadingGateways.value = false;

  // Auto-select default address
  const defaultAddr = addrs.find((a) => a.is_default);
  if (defaultAddr) selectedAddressId.value = defaultAddr.id;
  else if (addrs.length > 0) selectedAddressId.value = addrs[0].id;
});

async function pay(gatewaySlug: string) {
  if (!selectedAddressId.value) {
    error.value = "Selecciona una dirección de envío";
    return;
  }
  if (cartItems.value.length === 0) {
    error.value = "Tu carrito está vacío";
    return;
  }

  processing.value = true;
  error.value = "";

  try {
    // Create order
    const order = await api<{ order_number: string }>("/account/orders/checkout", {
      method: "POST",
      body: { address_id: selectedAddressId.value },
    });

    if (gatewaySlug === "flow") {
      // Create Flow payment
      const payment = await api<{ redirect_url: string }>("/payments/create-flow", {
        method: "POST",
        body: { order_number: order.order_number },
      });
      // Redirect to Flow
      window.location.href = payment.redirect_url;
    } else {
      // Future gateways - redirect to order page
      navigateTo(`/mi-cuenta/compras/${order.order_number}`);
    }
  } catch (e: any) {
    error.value = e.data?.detail || "Error al procesar el pedido";
    processing.value = false;
  }
}

useHead({ title: "Checkout - ByteDigital" });
</script>
