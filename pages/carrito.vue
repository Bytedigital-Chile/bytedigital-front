<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">Carrito de compras</h1>

    <div v-if="items.length === 0" class="text-center py-16">
      <ShoppingCart class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <p class="text-gray-500 mb-4">Tu carrito está vacío</p>
      <NuxtLink
        to="/"
        class="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
      >
        Seguir comprando
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Unavailable items warning -->
      <div
        v-if="hasUnavailableItems"
        class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
      >
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p class="font-medium text-amber-800">
              {{ unavailableCount === 1 ? 'Un producto tiene' : `${unavailableCount} productos tienen` }} problemas de stock
            </p>
            <p class="text-sm text-amber-700 mt-1">
              Los productos marcados en rojo no están disponibles o tienen stock limitado.
              Puedes eliminarlos o ajustar las cantidades para continuar con tu compra.
            </p>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="space-y-4 mb-8">
        <div
          v-for="item in items"
          :key="item.product.id"
          class="flex gap-4 border rounded-lg p-4 bg-white"
          :class="{
            'border-red-300 bg-red-50': item.stock_status === 'out_of_stock' || item.stock_status === 'inactive',
            'border-amber-300 bg-amber-50': item.stock_status === 'limited'
          }"
        >
          <img
            v-if="item.product.images?.[0]"
            :src="item.product.images[0].url"
            :alt="item.product.name"
            class="w-20 h-20 object-contain rounded"
            :class="{ 'opacity-50': item.stock_status === 'out_of_stock' || item.stock_status === 'inactive' }"
          />
          <div v-else class="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
            <ImageOff class="w-8 h-8 text-gray-400" />
          </div>
          <div class="flex-1 min-w-0">
            <NuxtLink
              :to="`/producto/${item.product.slug}`"
              class="font-medium hover:text-primary-600 line-clamp-2"
              :class="{ 'text-gray-400': item.stock_status === 'out_of_stock' || item.stock_status === 'inactive' }"
            >
              {{ item.product.name }}
            </NuxtLink>
            <p class="text-sm text-gray-500">{{ item.product.brand?.name }}</p>
            <p
              class="font-bold mt-1"
              :class="item.stock_status === 'out_of_stock' || item.stock_status === 'inactive' ? 'text-gray-400' : 'text-primary-600'"
            >
              {{ formatCLP(item.unit_price || item.product.sale_price || item.product.base_price) }}
            </p>

            <!-- Stock warning message -->
            <p v-if="item.stock_message" class="text-xs mt-1" :class="getStockMessageClass(item.stock_status)">
              <AlertCircle class="w-3 h-3 inline mr-1" />
              {{ item.stock_message }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="item.stock_status === 'out_of_stock' || item.stock_status === 'inactive'"
              @click="handleUpdateQuantity(item.product.id, item.quantity - 1)"
            >
              -
            </button>
            <span class="w-8 text-center">{{ item.quantity }}</span>
            <button
              class="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="item.stock_status === 'out_of_stock' || item.stock_status === 'inactive' || (item.available_stock && item.quantity >= item.available_stock)"
              @click="handleUpdateQuantity(item.product.id, item.quantity + 1)"
            >
              +
            </button>
          </div>
          <div class="flex flex-col items-end justify-between">
            <button
              class="text-red-400 hover:text-red-600 text-sm"
              @click="confirmRemove(item.product.id)"
            >
              Eliminar
            </button>
            <p class="font-bold" :class="{ 'text-gray-400': item.stock_status === 'out_of_stock' || item.stock_status === 'inactive' }">
              {{ formatCLP((item.unit_price || item.product.sale_price || item.product.base_price) * item.quantity) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Subtotal</span>
          <span class="font-medium">{{ formatCLP(cartTotal) }}</span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-gray-600">Envío</span>
          <span class="text-sm" :class="cartTotal >= 50000 ? 'text-green-600 font-medium' : 'text-gray-600'">
            {{ cartTotal >= 50000 ? "Gratis" : formatCLP(3990) }}
          </span>
        </div>
        <div class="flex justify-between items-center mb-6 border-t pt-4">
          <span class="text-lg font-semibold">Total</span>
          <span class="text-2xl font-bold text-primary-600">
            {{ formatCLP(cartTotal + (cartTotal >= 50000 ? 0 : 3990)) }}
          </span>
        </div>
        <div class="flex gap-4">
          <NuxtLink
            to="/"
            class="flex-1 text-center border border-gray-300 rounded-lg py-3 hover:bg-gray-50"
          >
            Seguir comprando
          </NuxtLink>
          <button
            class="flex-1 bg-primary-600 text-white rounded-lg py-3 font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="hasUnavailableItems || availableItemsCount === 0"
            @click="proceedToCheckout"
          >
            {{ hasUnavailableItems ? 'Resuelve los problemas para continuar' : 'Proceder al pago' }}
          </button>
        </div>
      </div>

      <!-- Suggestions when there are unavailable items -->
      <div v-if="hasUnavailableItems && suggestions.length > 0" class="mt-10">
        <h2 class="text-lg font-semibold mb-4">Te puede interesar</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="product in suggestions"
            :key="product.id"
            :to="`/producto/${product.slug}`"
            class="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white"
          >
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-24 object-contain mb-2"
            />
            <div v-else class="w-full h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
              <ImageOff class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-sm font-medium line-clamp-2 mb-1">{{ product.name }}</p>
            <p class="text-primary-600 font-bold text-sm">
              {{ formatCLP(product.sale_price || product.base_price) }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart, AlertTriangle, AlertCircle, ImageOff } from "lucide-vue-next";
import { formatCLP } from "~/utils/format";

const {
  items,
  removeFromCart,
  updateQuantity,
  cartTotal,
  hasUnavailableItems,
  unavailableCount,
  suggestions,
} = useCart();
const { show: showToast } = useToast();
const { isAuthenticated } = useAuth();

const availableItemsCount = computed(() =>
  items.value.filter((i) => i.stock_status === "available" || i.stock_status === "limited").length
);

function getStockMessageClass(status: string | undefined) {
  if (status === "out_of_stock" || status === "inactive") return "text-red-600";
  if (status === "limited") return "text-amber-600";
  return "text-gray-500";
}

async function confirmRemove(productId: number) {
  if (!confirm("¿Eliminar este producto del carrito?")) return;
  const ok = await removeFromCart(productId);
  if (ok) showToast("Producto eliminado del carrito");
  else showToast("Error al eliminar", "error");
}

async function handleUpdateQuantity(productId: number, quantity: number) {
  const ok = await updateQuantity(productId, quantity);
  if (!ok) showToast("Error al actualizar cantidad", "error");
}

function proceedToCheckout() {
  if (hasUnavailableItems.value) {
    showToast("Resuelve los problemas de stock antes de continuar", "error");
    return;
  }
  if (isAuthenticated.value) {
    navigateTo("/checkout");
  } else {
    navigateTo("/login?redirect=/checkout");
  }
}

useHead({ title: "Carrito - ByteDigital" });
</script>
