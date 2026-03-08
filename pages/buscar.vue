<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-2">
      Resultados para "{{ searchQuery }}"
    </h1>
    <p class="text-gray-500 mb-6">{{ total }} productos encontrados</p>

    <div class="flex gap-8">
      <!-- Filters -->
      <aside class="hidden md:block w-64 flex-shrink-0">
        <ProductProductFilters
          :brands="brands"
          :selected-brand="filters.brand"
          :selected-condition="filters.condition"
          @update:brand="filters.brand = $event; fetchResults()"
          @update:condition="filters.condition = $event; fetchResults()"
        />
      </aside>

      <!-- Results -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-4">
          <ProductProductSort v-model="filters.sort" @update:model-value="fetchResults()" />
        </div>
        <ProductProductGrid :products="products" />

        <div v-if="pages > 1" class="flex justify-center gap-2 mt-8">
          <button
            v-for="p in pages"
            :key="p"
            class="w-10 h-10 rounded-lg text-sm font-medium"
            :class="p === filters.page ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            @click="filters.page = p; fetchResults()"
          >
            {{ p }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Brand, PaginatedResponse, Product } from "~/types";

const route = useRoute();
const { api } = useApi();

const searchQuery = computed(() => (route.query.q as string) || "");
const products = ref<Product[]>([]);
const brands = ref<Brand[]>([]);
const total = ref(0);
const pages = ref(0);

const filters = reactive({
  brand: "",
  condition: "",
  sort: "newest",
  page: 1,
});

async function fetchResults() {
  if (!searchQuery.value) return;
  const params = new URLSearchParams();
  params.set("search", searchQuery.value);
  params.set("page", String(filters.page));
  params.set("page_size", "20");
  params.set("sort", filters.sort);
  if (filters.brand) params.set("brand_slug", filters.brand);
  if (filters.condition) params.set("condition", filters.condition);

  const data = await api<PaginatedResponse<Product>>(`/products/?${params}`);
  products.value = data.items;
  total.value = data.total;
  pages.value = data.pages;
}

onMounted(async () => {
  brands.value = await api<Brand[]>("/brands/").catch(() => []);
  await fetchResults();
});

watch(() => route.query.q, () => {
  filters.page = 1;
  fetchResults();
});
</script>
