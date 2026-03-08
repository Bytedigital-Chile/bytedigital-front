import type { Product } from "~/types";

export function useSearch() {
  const query = ref("");
  const results = ref<Product[]>([]);
  const loading = ref(false);
  const { api } = useApi();

  let timeout: ReturnType<typeof setTimeout>;

  watch(query, (val) => {
    clearTimeout(timeout);
    if (!val || val.length < 2) {
      results.value = [];
      return;
    }
    loading.value = true;
    timeout = setTimeout(async () => {
      try {
        const data = await api<any>(`/products/?search=${encodeURIComponent(val)}&page_size=8`);
        results.value = data.items;
      } catch {
        results.value = [];
      } finally {
        loading.value = false;
      }
    }, 300);
  });

  return { query, results, loading };
}
