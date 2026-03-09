<template>
  <NuxtLink :to="`/producto/${product.slug}`" class="group">
    <div class="border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300">
      <!-- Image -->
      <div class="aspect-square bg-gradient-to-br from-gray-50 to-primary-50/30 relative overflow-hidden">
        <img
          v-if="product.images?.[0]"
          :src="product.images[0].url"
          :alt="product.name"
          class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
          <ImageOff class="w-12 h-12" />
        </div>

        <!-- Wishlist heart -->
        <button
          class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-colors hover:bg-red-50"
          :class="inWishlist ? 'text-red-500' : 'text-gray-400'"
          @click.prevent="handleWishlist"
        >
          <Heart class="w-4 h-4" :class="inWishlist ? 'fill-current' : ''" />
        </button>

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            v-if="product.sale_price && product.sale_price < product.base_price"
            class="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
          >
            -{{ calcDiscount(product.base_price, product.sale_price) }}%
          </span>
          <span
            v-if="product.is_featured"
            class="bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
          >
            NUEVO
          </span>
        </div>

        <!-- Hover add to cart overlay -->
        <div class="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-lg disabled:opacity-50"
            :disabled="adding"
            @click.prevent="handleAddToCart"
          >
            <Loader2 v-if="adding" class="w-4 h-4 animate-spin" />
            <ShoppingCart v-else class="w-4 h-4" />
            {{ adding ? 'Agregando...' : 'Agregar al carro' }}
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="p-4">
        <p class="text-xs text-gray-400 mb-1 uppercase tracking-wide">{{ product.brand?.name }}</p>
        <h3 class="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-600 transition-colors">
          {{ product.name }}
        </h3>
        <div class="mt-3">
          <ProductPriceDisplay :product="product" />
        </div>
        <p v-if="product.stock > 0" class="text-xs text-emerald-600 mt-2 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          En stock
        </p>
        <p v-else class="text-xs text-red-500 mt-2 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
          Sin stock
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ShoppingCart, ImageOff, Heart, Loader2 } from "lucide-vue-next";
import type { Product } from "~/types";
import { calcDiscount } from "~/utils/format";

const props = defineProps<{ product: Product }>();

const { addToCart } = useCart();
const { show: showToast } = useToast();
const { isInWishlist, toggleWishlist } = useWishlist();
const { isAuthenticated } = useAuth();

const inWishlist = computed(() => isInWishlist(props.product.id));
const adding = ref(false);

async function handleAddToCart() {
  if (adding.value) return;
  adding.value = true;
  try {
    const ok = await addToCart(props.product);
    if (ok) {
      showToast("Producto agregado al carrito");
    } else {
      showToast("No se pudo agregar al carrito", "error");
    }
  } finally {
    adding.value = false;
  }
}

function handleWishlist() {
  if (!isAuthenticated.value) {
    navigateTo(`/login?redirect=${encodeURIComponent(useRoute().fullPath)}`);
    return;
  }
  toggleWishlist(props.product.id);
}
</script>
