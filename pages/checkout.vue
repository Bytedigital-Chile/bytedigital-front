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
          class="flex items-start gap-3 border rounded-lg p-4 transition-colors"
          :class="[
            selectedAddressId === addr.id ? 'border-primary-500 bg-primary-50' : 'hover:border-gray-300',
            !isAddressDeliverable(addr) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]"
        >
          <input
            v-model="selectedAddressId"
            type="radio"
            :value="addr.id"
            :disabled="!isAddressDeliverable(addr)"
            class="mt-1"
          />
          <div class="flex-1">
            <p class="font-medium">{{ addr.label }}</p>
            <p class="text-sm text-gray-600">
              {{ addr.street }} {{ addr.number }}{{ addr.apartment ? `, Depto ${addr.apartment}` : "" }}
            </p>
            <p class="text-sm text-gray-600">{{ addr.comuna }}, {{ addr.region }}</p>
            <p v-if="addrShipping[addr.id] && !addrShipping[addr.id].is_deliverable" class="text-xs text-red-600 mt-1">
              ⚠ No despachamos a esta comuna
            </p>
            <p
              v-else-if="addrShipping[addr.id]"
              class="text-xs mt-1"
              :class="addrShipping[addr.id].free_shipping_applied ? 'text-green-600' : 'text-gray-500'"
            >
              Envío: {{
                addrShipping[addr.id].free_shipping_applied
                  ? "Gratis"
                  : formatCLP(addrShipping[addr.id].price)
              }}
            </p>
          </div>
        </label>
      </div>
    </div>

    <!-- Step 2: Billing document -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">2. Documento tributario</h2>
      <div class="space-y-4">
        <div class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="billing.document_type" type="radio" value="boleta" />
            <span>Boleta</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="billing.document_type" type="radio" value="factura" />
            <span>Factura</span>
          </label>
        </div>

        <div v-if="billing.document_type === 'factura'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div class="sm:col-span-1">
            <input
              v-model="billing.rut"
              placeholder="RUT (12.345.678-9)"
              :class="{ 'border-red-500': rutError }"
              class="w-full border rounded-lg px-3 py-2"
              @blur="validateRut"
            />
            <p v-if="rutError" class="text-xs text-red-500 mt-1">{{ rutError }}</p>
          </div>
          <input
            v-model="billing.razon_social"
            placeholder="Razón Social"
            class="w-full border rounded-lg px-3 py-2"
          />
          <input
            v-model="billing.giro"
            placeholder="Giro"
            class="w-full border rounded-lg px-3 py-2"
          />
          <input
            v-model="billing.address"
            placeholder="Dirección de facturación"
            class="w-full border rounded-lg px-3 py-2"
          />
          <input
            v-model="billing.email"
            type="email"
            placeholder="Email facturación (opcional)"
            class="w-full border rounded-lg px-3 py-2 sm:col-span-2"
          />
        </div>
      </div>
    </div>

    <!-- Step 3: Order summary -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">3. Resumen del pedido</h2>
      <div class="border rounded-lg overflow-hidden">
        <NuxtLink
          v-for="item in cartItems"
          :key="item.product.id"
          :to="`/producto/${item.product.slug}`"
          class="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-gray-50 transition-colors"
        >
          <img
            v-if="item.product.images?.[0]"
            :src="item.product.images[0].url"
            class="w-12 h-12 object-contain rounded"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate hover:text-primary-600">{{ item.product.name }}</p>
            <p class="text-xs text-gray-500">x{{ item.quantity }}</p>
          </div>
          <p class="text-sm font-semibold">
            {{ formatCLP((item.unit_price || item.product.sale_price || item.product.base_price) * item.quantity) }}
          </p>
        </NuxtLink>
      </div>
      <div class="mt-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal</span>
          <span>{{ formatCLP(cartTotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Envío</span>
          <span
            v-if="activeShipping && activeShipping.free_shipping_applied"
            class="text-green-600"
          >
            Gratis
          </span>
          <span v-else-if="activeShipping">{{ formatCLP(activeShipping.price) }}</span>
          <span v-else class="text-gray-400">—</span>
        </div>
        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span class="text-primary-600">
            {{ formatCLP(cartTotal + (activeShipping && activeShipping.is_deliverable ? activeShipping.price : 0)) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Step 4: Payment method -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">4. Método de pago</h2>
      <div v-if="gateways.length === 0" class="border rounded-lg p-4 text-center text-gray-500 text-sm">
        No hay métodos de pago disponibles en este momento.
      </div>
      <div v-else class="space-y-3">
        <label
          v-for="gw in gateways"
          :key="gw.slug"
          class="flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors"
          :class="paymentMethod === gw.slug ? 'border-primary-500 bg-primary-50' : 'hover:border-gray-300'"
        >
          <input v-model="paymentMethod" type="radio" :value="gw.slug" />
          <div class="flex-1">
            <p class="font-medium">{{ gw.name }}</p>
            <p v-if="gw.description" class="text-xs text-gray-500">{{ gw.description }}</p>
          </div>
        </label>
      </div>

      <div v-if="paymentMethod === 'bank_transfer'" class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
        <p class="font-medium mb-1">Pago por transferencia manual</p>
        <p class="text-gray-700">
          Al confirmar, te mostraremos los datos bancarios y el monto exacto.
          Procesamos tu pedido al recibir el pago.
        </p>
      </div>
    </div>

    <!-- Submit -->
    <div class="flex items-center justify-between border-t pt-6">
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <div class="flex-1" />
      <button
        class="bg-primary-600 text-white rounded-lg px-8 py-3 font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        :disabled="!canSubmit || processing"
        @click="submitCheckout"
      >
        {{ processing ? "Procesando..." : submitLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomerAddress } from "~/types";
import type { ShippingQuote } from "~/composables/useShipping";
import { formatCLP } from "~/utils/format";

definePageMeta({ middleware: "auth" });

const { api } = useApi();
const { items: cartItems, cartTotal } = useCart();
const { calculate } = useShipping();

interface PaymentGatewayPublic {
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
}

const addresses = ref<CustomerAddress[]>([]);
const selectedAddressId = ref<number | null>(null);
const gateways = ref<PaymentGatewayPublic[]>([]);
const processing = ref(false);
const error = ref("");

// Shipping quote per address (resolved by comuna name → comuna_id server-side)
// We query the per-comuna shipping endpoint for each address
const addrShipping = ref<Record<number, ShippingQuote>>({});

async function loadShippingForAddress(addr: CustomerAddress) {
  try {
    // Resolve comuna by name via /geography/regions/{id}/comunas would need region lookup;
    // simpler: just try matching from loaded regions+comunas. But to keep it simple, use a
    // dedicated resolver endpoint would be ideal. For now: look up all regions+comunas by
    // name (backend recalculates on checkout anyway).
    const regions = await api<{ id: number; name: string }[]>("/geography/regions");
    const region = regions.find(
      (r) => r.name.toLowerCase() === addr.region.toLowerCase(),
    );
    if (!region) return;
    const comunas = await api<{ id: number; name: string }[]>(
      `/geography/regions/${region.id}/comunas`,
    );
    const comuna = comunas.find(
      (c) => c.name.toLowerCase() === addr.comuna.toLowerCase(),
    );
    if (!comuna) return;
    const quote = await calculate(comuna.id, cartTotal.value);
    addrShipping.value[addr.id] = quote;
  } catch {
    // silent — if calculation fails, the address shows without shipping estimate
  }
}

function isAddressDeliverable(addr: CustomerAddress): boolean {
  const q = addrShipping.value[addr.id];
  return !q || q.is_deliverable;
}

const activeShipping = computed(() => {
  if (!selectedAddressId.value) return null;
  return addrShipping.value[selectedAddressId.value] || null;
});

// Billing
const billing = reactive<{
  document_type: "boleta" | "factura";
  rut: string;
  razon_social: string;
  giro: string;
  address: string;
  email: string;
}>({
  document_type: "boleta",
  rut: "",
  razon_social: "",
  giro: "",
  address: "",
  email: "",
});
const rutError = ref<string | null>(null);

function validateRut() {
  const raw = billing.rut.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
  if (!raw) {
    rutError.value = null;
    return true;
  }
  if (!/^\d{1,8}-[\dK]$/.test(raw)) {
    rutError.value = "Formato RUT inválido (ej: 12345678-9)";
    return false;
  }
  const [body, dv] = raw.split("-");
  let s = 0;
  let factor = 2;
  for (const ch of [...body].reverse()) {
    s += parseInt(ch) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const expected = 11 - (s % 11);
  const expectedDv = expected === 11 ? "0" : expected === 10 ? "K" : String(expected);
  if (dv !== expectedDv) {
    rutError.value = "Dígito verificador inválido";
    return false;
  }
  rutError.value = null;
  return true;
}

// Payment
const paymentMethod = ref<string>("flow");

const canSubmit = computed(() => {
  if (!selectedAddressId.value) return false;
  if (cartItems.value.length === 0) return false;
  if (activeShipping.value && !activeShipping.value.is_deliverable) return false;
  if (billing.document_type === "factura") {
    if (rutError.value) return false;
    if (!billing.rut || !billing.razon_social || !billing.giro || !billing.address) {
      return false;
    }
  }
  return true;
});

const submitLabel = computed(() => {
  if (paymentMethod.value === "flow") return "Pagar con tarjeta";
  if (paymentMethod.value === "bank_transfer") return "Continuar con transferencia";
  return "Continuar";
});

async function submitCheckout() {
  if (!canSubmit.value) return;
  if (billing.document_type === "factura" && !validateRut()) {
    error.value = "Corrige los datos de facturación";
    return;
  }
  processing.value = true;
  error.value = "";

  try {
    const payload: any = {
      address_id: selectedAddressId.value,
      billing: {
        document_type: billing.document_type,
        ...(billing.document_type === "factura"
          ? {
              rut: billing.rut,
              razon_social: billing.razon_social,
              giro: billing.giro,
              address: billing.address,
              email: billing.email || undefined,
            }
          : {}),
      },
      payment_method: paymentMethod.value,
    };

    const order = await api<{
      id: number;
      order_number: string;
      bank_transfer_info: Record<string, string> | null;
      payment_method: string;
    }>("/account/orders/checkout", { method: "POST", body: payload });

    if (paymentMethod.value === "flow") {
      const payment = await api<{ redirect_url: string }>("/payments/create-flow", {
        method: "POST",
        body: { order_number: order.order_number },
      });
      window.location.href = payment.redirect_url;
    } else {
      // Bank transfer — go to confirmation page
      await navigateTo(`/pedido/${order.order_number}/transferencia`);
    }
  } catch (e: any) {
    const detail = e.data?.detail;
    if (detail && typeof detail === "object" && detail.code) {
      if (detail.code === "comuna_not_deliverable") {
        error.value = `Ya no despachamos a ${detail.comuna}. Elige otra dirección.`;
      } else if (detail.code === "rut_invalid") {
        error.value = "RUT inválido";
      } else if (detail.code === "billing_incomplete") {
        error.value = "Completa los datos de facturación";
      } else if (detail.code === "bank_transfer_not_configured") {
        error.value = "Transferencia no disponible en este momento";
      } else {
        error.value = detail.message || "Error al procesar el pedido";
      }
    } else {
      error.value = detail || "Error al procesar el pedido";
    }
    processing.value = false;
  }
}

onMounted(async () => {
  const [addrs, gws] = await Promise.all([
    api<CustomerAddress[]>("/account/addresses").catch(() => []),
    api<PaymentGatewayPublic[]>("/payment-gateways/active").catch(() => []),
  ]);
  addresses.value = addrs;
  gateways.value = gws;

  // Preselect first active gateway
  if (gws.length > 0) paymentMethod.value = gws[0].slug;

  const defaultAddr = addrs.find((a) => a.is_default);
  if (defaultAddr) selectedAddressId.value = defaultAddr.id;
  else if (addrs.length > 0) selectedAddressId.value = addrs[0].id;

  // Load shipping quotes for each address in parallel
  await Promise.all(addrs.map(loadShippingForAddress));
});

useHead({ title: "Checkout - ByteDigital" });
</script>
