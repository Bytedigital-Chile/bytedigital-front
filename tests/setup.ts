import { vi } from "vitest";
import { ref, computed, watch, reactive } from "vue";

// NOTE: import.meta.server and import.meta.client are replaced at compile
// time via the `define` option in vitest.config.ts (same approach Nuxt uses).

// Shared state store for useState mock (simulates Nuxt's useState)
const stateStore = new Map<string, any>();

(globalThis as any).useState = (key: string, init?: () => any) => {
  if (!stateStore.has(key)) {
    stateStore.set(key, ref(init ? init() : undefined));
  }
  return stateStore.get(key);
};

(globalThis as any).useRuntimeConfig = () => ({
  public: { apiBase: "http://localhost:8000" },
});

(globalThis as any).$fetch = {
  create: (opts: any) => {
    const fetchFn = vi.fn();
    (fetchFn as any)._baseURL = opts.baseURL;
    return fetchFn;
  },
};

// Mock useApi (Nuxt auto-import used by useSearch and other composables)
(globalThis as any).useApi = () => {
  const config = (globalThis as any).useRuntimeConfig();
  const api = (globalThis as any).$fetch.create({
    baseURL: config.public.apiBase as string,
  });
  return { api };
};

// Expose Vue reactivity as globals (Nuxt auto-imports these)
(globalThis as any).ref = ref;
(globalThis as any).computed = computed;
(globalThis as any).watch = watch;
(globalThis as any).reactive = reactive;

// Reset shared state and localStorage between tests
beforeEach(() => {
  stateStore.clear();
  localStorage.clear();
});
