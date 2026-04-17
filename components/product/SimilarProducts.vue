<template>
  <section v-if="products.length > 0" class="mt-16 border-t pt-12">
    <h2 class="text-2xl font-bold mb-6">Productos similares</h2>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  slug: string;
  limit?: number;
}>();

const { api } = useApi();
const products = ref<any[]>([]);

async function load() {
  if (!props.slug) return;
  try {
    products.value = await api<any[]>(`/products/${props.slug}/similar`, {
      params: { limit: props.limit ?? 8 },
    });
  } catch {
    products.value = [];
  }
}

onMounted(load);

watch(
  () => props.slug,
  () => load(),
);
</script>
