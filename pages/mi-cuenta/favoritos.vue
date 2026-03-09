<template>
  <div>
    <h2 class="text-xl font-bold mb-6">Productos favoritos</h2>

    <div v-if="items.length === 0" class="text-center py-12 text-gray-500">
      <Heart class="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p class="text-lg mb-2">No tienes productos favoritos</p>
      <NuxtLink to="/" class="text-primary-600 hover:underline">Explorar productos</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="item in items" :key="item.id" class="relative">
        <ProductCard :product="item.product" />
        <button
          class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-50"
          @click="removeFromWishlist(item.product_id)"
        >
          <Heart class="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart } from "lucide-vue-next";

const { items, fetchWishlist, removeFromWishlist } = useWishlist();

onMounted(fetchWishlist);

useHead({ title: "Favoritos - ByteDigital" });
</script>
