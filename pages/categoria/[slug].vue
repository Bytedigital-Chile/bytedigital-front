<template>
  <!-- Not found -->
  <div v-if="notFound" class="max-w-7xl mx-auto px-4 py-16 text-center">
    <p class="text-gray-500 text-lg">Categoria no encontrada</p>
    <NuxtLink to="/" class="text-primary-600 hover:underline mt-4 inline-block">Volver al inicio</NuxtLink>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 py-6">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500 mb-4">
      <NuxtLink to="/" class="hover:text-primary-600">Inicio</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-gray-900">{{ category?.name }}</span>
    </nav>

    <h1 class="text-2xl font-bold mb-6">{{ category?.name }}</h1>

    <div class="flex gap-8">
      <!-- Filters sidebar -->
      <aside class="hidden md:block w-64 flex-shrink-0">
        <ProductProductFilters
          :brands="brands"
          :selected-brand="filters.brand"
          :selected-condition="filters.condition"
          :min-price="filters.minPrice"
          :max-price="filters.maxPrice"
          @update:brand="filters.brand = $event; fetchProducts()"
          @update:condition="filters.condition = $event; fetchProducts()"
          @update:min-price="filters.minPrice = $event; fetchProducts()"
          @update:max-price="filters.maxPrice = $event; fetchProducts()"
        />
      </aside>

      <!-- Products -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-500">{{ total }} productos</p>
          <ProductProductSort v-model="filters.sort" @update:model-value="fetchProducts()" />
        </div>
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <ProductProductGrid v-else :products="products" />

        <!-- Pagination -->
        <div v-if="pages > 1" class="flex justify-center gap-2 mt-8">
          <button
            v-for="p in pages"
            :key="p"
            class="w-10 h-10 rounded-lg text-sm font-medium"
            :class="p === filters.page ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            @click="filters.page = p; fetchProducts()"
          >
            {{ p }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Brand, Category, PaginatedResponse, Product } from "~/types";

const route = useRoute();
const { api } = useApi();

const category = ref<Category | null>(null);
const products = ref<Product[]>([]);
const brands = ref<Brand[]>([]);
const total = ref(0);
const pages = ref(0);
const loading = ref(false);
const notFound = ref(false);

const filters = reactive({
  brand: "",
  condition: "",
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  sort: "newest",
  page: 1,
});

async function fetchProducts() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.set("category_slug", route.params.slug as string);
    params.set("page", String(filters.page));
    params.set("page_size", "20");
    params.set("sort", filters.sort);
    if (filters.brand) params.set("brand_slug", filters.brand);
    if (filters.condition) params.set("condition", filters.condition);
    if (filters.minPrice) params.set("min_price", String(filters.minPrice));
    if (filters.maxPrice) params.set("max_price", String(filters.maxPrice));

    const data = await api<PaginatedResponse<Product>>(`/products/?${params}`);
    products.value = data.items;
    total.value = data.total;
    pages.value = data.pages;
  } catch {
    products.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    const [cat, b] = await Promise.all([
      api<Category>(`/categories/${route.params.slug}`),
      api<Brand[]>("/brands/"),
    ]);
    category.value = cat;
    brands.value = b;
    await fetchProducts();
  } catch {
    notFound.value = true;
  }
});

useHead(() => ({
  title: category.value ? `${category.value.name} - ByteDigital` : "Categoría - ByteDigital",
}));
</script>
