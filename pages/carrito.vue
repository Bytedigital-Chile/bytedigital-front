<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">Carrito de compras</h1>

    <div v-if="items.length === 0" class="text-center py-16">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      <p class="text-gray-500 mb-4">Tu carrito está vacío</p>
      <NuxtLink
        to="/"
        class="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
      >
        Seguir comprando
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Items -->
      <div class="space-y-4 mb-8">
        <div
          v-for="item in items"
          :key="item.product.id"
          class="flex gap-4 border rounded-lg p-4 bg-white"
        >
          <img
            v-if="item.product.images?.[0]"
            :src="item.product.images[0].url"
            :alt="item.product.name"
            class="w-20 h-20 object-contain rounded"
          />
          <div class="flex-1 min-w-0">
            <NuxtLink :to="`/producto/${item.product.slug}`" class="font-medium hover:text-primary-600 line-clamp-2">
              {{ item.product.name }}
            </NuxtLink>
            <p class="text-sm text-gray-500">{{ item.product.brand?.name }}</p>
            <p class="font-bold text-primary-600 mt-1">
              {{ formatCLP(item.product.sale_price ?? item.product.base_price) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
              @click="updateQuantity(item.product.id, item.quantity - 1)"
            >
              -
            </button>
            <span class="w-8 text-center">{{ item.quantity }}</span>
            <button
              class="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
              @click="updateQuantity(item.product.id, item.quantity + 1)"
            >
              +
            </button>
          </div>
          <div class="flex flex-col items-end justify-between">
            <button
              class="text-red-400 hover:text-red-600 text-sm"
              @click="removeFromCart(item.product.id)"
            >
              Eliminar
            </button>
            <p class="font-bold">
              {{ formatCLP((item.product.sale_price ?? item.product.base_price) * item.quantity) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold">Total</span>
          <span class="text-2xl font-bold text-primary-600">{{ formatCLP(cartTotal) }}</span>
        </div>
        <div class="flex gap-4">
          <NuxtLink
            to="/"
            class="flex-1 text-center border border-gray-300 rounded-lg py-3 hover:bg-gray-50"
          >
            Seguir comprando
          </NuxtLink>
          <button
            class="flex-1 bg-primary-600 text-white rounded-lg py-3 font-semibold hover:bg-primary-700"
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCLP } from "~/utils/format";

const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

useHead({ title: "Carrito - ByteDigital" });
</script>
