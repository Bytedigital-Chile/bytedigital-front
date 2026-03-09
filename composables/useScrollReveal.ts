import { useIntersectionObserver } from "@vueuse/core";
import { ref, type Ref } from "vue";

export function useScrollReveal(options?: { threshold?: number }) {
  const target = ref<HTMLElement | null>(null) as Ref<HTMLElement | null>;
  const isVisible = ref(false);

  useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true;
      }
    },
    { threshold: options?.threshold ?? 0.1 },
  );

  return { target, isVisible };
}
