// Re-export Vue reactivity primitives and Nuxt mock globals
// This file is aliased to "#imports" so that source files importing from
// "#imports" resolve correctly in the test environment.
export { ref, computed, watch, reactive, toRef, toRefs, nextTick } from "vue";

export const useState = (globalThis as any).useState;
export const useRuntimeConfig = (globalThis as any).useRuntimeConfig;
