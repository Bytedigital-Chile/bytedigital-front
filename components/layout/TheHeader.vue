<template>
  <header class="bg-white border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
          ByteDigital
        </NuxtLink>

        <!-- Search -->
        <div class="hidden md:block flex-1 max-w-xl mx-8">
          <LayoutSearchBar />
        </div>

        <!-- Cart -->
        <NuxtLink to="/carrito" class="relative flex items-center gap-2 text-gray-700 hover:text-primary-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span class="text-sm font-medium">{{ formatCLP(cartTotal) }}</span>
          <span
            v-if="cartCount > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cartCount }}
          </span>
        </NuxtLink>
      </div>

      <!-- Mobile search -->
      <div class="md:hidden pb-3">
        <LayoutSearchBar />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { formatCLP } from "~/utils/format";

const { cartTotal, cartCount } = useCart();
</script>
