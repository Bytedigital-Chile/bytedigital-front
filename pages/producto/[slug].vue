<template>
  <!-- Loading -->
  <div v-if="loading" class="max-w-7xl mx-auto px-4 py-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="aspect-square bg-gray-200 rounded-lg animate-pulse" />
      <div class="space-y-4">
        <div class="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div class="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div class="h-12 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
    </div>
  </div>
  <!-- Not found -->
  <div v-else-if="notFound" class="max-w-7xl mx-auto px-4 py-16 text-center">
    <p class="text-gray-500 text-lg">Producto no encontrado</p>
    <NuxtLink to="/" class="text-primary-600 hover:underline mt-4 inline-block">Volver al inicio</NuxtLink>
  </div>
  <!-- Product content -->
  <div v-else-if="product" class="max-w-7xl mx-auto px-4 py-6">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500 mb-6">
      <NuxtLink to="/" class="hover:text-primary-600">Inicio</NuxtLink>
      <template v-if="product.categories?.length">
        <span class="mx-2">/</span>
        <NuxtLink
          :to="`/categoria/${product.categories[0].slug}`"
          class="hover:text-primary-600"
        >
          {{ product.categories[0].name }}
        </NuxtLink>
      </template>
      <span class="mx-2">/</span>
      <span class="text-gray-900">{{ product.name }}</span>
    </nav>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Gallery -->
      <ProductGallery :images="product.images" />

      <!-- Info -->
      <div>
        <p v-if="product.brand" class="text-sm text-gray-500 mb-1">{{ product.brand.name }}</p>
        <h1 class="text-2xl font-bold mb-4">{{ product.name }}</h1>

        <!-- Price -->
        <div class="mb-6">
          <div v-if="product.sale_price && product.sale_price < product.base_price">
            <p class="text-sm text-gray-400 line-through">{{ formatCLP(product.base_price) }}</p>
            <p class="text-3xl font-bold text-primary-600">{{ formatCLP(product.sale_price) }}</p>
            <span class="inline-block bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded mt-1">
              -{{ calcDiscount(product.base_price, product.sale_price) }}% dcto
            </span>
          </div>
          <div v-else>
            <p class="text-3xl font-bold text-gray-900">{{ formatCLP(product.base_price) }}</p>
          </div>

          <div v-if="product.transfer_price && product.transfer_price < displayedBasePrice" class="mt-3 border-t pt-3 space-y-1">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium text-gray-700">Pago con transferencia</span>
              <span class="text-xl font-bold text-green-600">{{ formatCLP(product.transfer_price) }}</span>
            </div>
            <div class="flex items-baseline justify-between text-sm text-gray-500">
              <span>Otros medios de pago</span>
              <span>{{ formatCLP(displayedBasePrice) }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 mt-1">Precio contado</p>
        </div>

        <!-- Stock -->
        <div class="mb-6">
          <p v-if="product.stock > 0" class="text-green-600 font-medium">
            En stock ({{ product.stock }} disponibles)
          </p>
          <p v-else class="text-red-500 font-medium">Sin stock</p>
        </div>

        <!-- Condition -->
        <div class="mb-6">
          <span
            class="inline-block border rounded px-3 py-1 text-sm"
            :class="{
              'border-green-200 bg-green-50 text-green-700': product.condition === 'new',
              'border-yellow-200 bg-yellow-50 text-yellow-700': product.condition === 'open_box',
              'border-blue-200 bg-blue-50 text-blue-700': product.condition === 'refurbished',
            }"
          >
            {{ conditionLabel }}
          </span>
        </div>

        <!-- Shipping calculator -->
        <div class="my-4">
          <ProductShippingCalculator :subtotal="product.base_price" />
        </div>

        <!-- Buy now + Add to cart + Wishlist -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            :disabled="product.stock <= 0 || buyingNow || adding"
            @click="onBuyNow"
          >
            <Loader2 v-if="buyingNow" class="w-5 h-5 animate-spin" />
            {{ buyingNow ? 'Procesando...' : 'Comprar ahora' }}
          </button>
          <button
            class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            :disabled="product.stock <= 0 || adding || buyingNow"
            @click="onAddToCart"
          >
            <Loader2 v-if="adding" class="w-5 h-5 animate-spin" />
            {{ adding ? 'Agregando...' : 'Agregar al carrito' }}
          </button>
          <button
            class="px-4 py-3 border-2 rounded-lg transition-colors"
            :class="inWishlist ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'"
            @click="handleWishlist"
            aria-label="Agregar a favoritos"
          >
            <Heart class="w-5 h-5" :class="inWishlist ? 'fill-current' : ''" />
          </button>
        </div>

        <!-- Short description -->
        <p v-if="product.short_description" class="text-gray-600 mt-6">
          {{ product.short_description }}
        </p>

        <!-- SKU -->
        <p v-if="product.sku" class="text-xs text-gray-400 mt-4">SKU: {{ product.sku }}</p>
      </div>
    </div>

    <!-- Description -->
    <div v-if="product.description" class="mt-12">
      <h2 class="text-xl font-bold mb-4">Descripción</h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="product-description text-gray-700" v-html="product.description" />
    </div>

    <!-- Specs -->
    <div class="mt-12">
      <ProductSpecs :specs="product.specs" :attribute-values="product.attribute_values" />
    </div>

    <!-- Similar products -->
    <ProductSimilarProducts :slug="product.slug" :limit="8" />
  </div>
</template>

<script setup lang="ts">
import { Heart, Loader2 } from "lucide-vue-next";
import type { Product } from "~/types";
import { calcDiscount, formatCLP } from "~/utils/format";

const route = useRoute();
const { api } = useApi();
const { addToCart } = useCart();
const { show: showToast } = useToast();
const { addProduct } = useRecentlyViewed();
const { isInWishlist, toggleWishlist } = useWishlist();
const { isAuthenticated } = useAuth();

const product = ref<Product | null>(null);
const loading = ref(true);
const notFound = ref(false);
const adding = ref(false);
const buyingNow = ref(false);

const conditionLabel = computed(() => {
  const map: Record<string, string> = {
    new: "Nuevo",
    open_box: "Open Box",
    refurbished: "Reacondicionado",
  };
  return map[product.value?.condition || "new"] || "Nuevo";
});

const inWishlist = computed(() => product.value ? isInWishlist(product.value.id) : false);

const displayedBasePrice = computed(() => {
  if (!product.value) return 0;
  const p: any = product.value;
  if (p.sale_price && p.sale_price < p.base_price) return p.sale_price;
  return p.base_price;
});

async function onAddToCart() {
  if (product.value && !adding.value) {
    adding.value = true;
    try {
      const ok = await addToCart(product.value);
      if (ok) {
        showToast("Producto agregado al carrito");
      } else {
        showToast("No se pudo agregar al carrito", "error");
      }
    } finally {
      adding.value = false;
    }
  }
}

async function onBuyNow() {
  if (!product.value || buyingNow.value) return;
  buyingNow.value = true;
  try {
    const ok = await addToCart(product.value);
    if (!ok) {
      showToast("No se pudo agregar al carrito", "error");
      return;
    }
    const target = isAuthenticated.value ? "/checkout" : "/login?redirect=/checkout";
    await navigateTo(target);
  } finally {
    buyingNow.value = false;
  }
}

function handleWishlist() {
  if (!isAuthenticated.value) {
    navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }
  if (product.value) {
    toggleWishlist(product.value.id);
  }
}

onMounted(async () => {
  try {
    product.value = await api<Product>(`/products/${route.params.slug}`);
    if (product.value) {
      addProduct(product.value);
    }
  } catch {
    notFound.value = true;
  } finally {
    loading.value = false;
  }
});

useHead(() => ({
  title: product.value ? `${product.value.name} - ByteDigital` : "Producto - ByteDigital",
  meta: product.value?.meta_description
    ? [{ name: "description", content: product.value.meta_description }]
    : [],
}));
</script>
