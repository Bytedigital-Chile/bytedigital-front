<template>
  <section v-if="offers.length" ref="target" class="my-10 -mx-4 px-4 py-8 bg-gradient-to-r from-red-50/80 to-orange-50/50 rounded-2xl">
    <HomeSectionHeader
      title="Ofertas Imperdibles"
      badge="HOT"
      badge-class="bg-red-100 text-red-600 animate-pulse"
    />
    <!-- Flash offer countdown -->
    <div v-if="flashOffer" class="mb-6 flex items-center gap-3 text-sm">
      <Flame class="w-4 h-4 text-red-500" />
      <span class="text-gray-600">Oferta flash termina en:</span>
      <div class="flex gap-1.5">
        <span class="bg-gray-900 text-white font-mono font-bold px-2 py-1 rounded text-xs">{{ countdown.hours }}</span>
        <span class="text-gray-400 font-bold">:</span>
        <span class="bg-gray-900 text-white font-mono font-bold px-2 py-1 rounded text-xs">{{ countdown.minutes }}</span>
        <span class="text-gray-400 font-bold">:</span>
        <span class="bg-gray-900 text-white font-mono font-bold px-2 py-1 rounded text-xs">{{ countdown.seconds }}</span>
      </div>
    </div>
    <div :class="isVisible ? 'reveal-visible' : 'reveal-hidden'">
      <ProductGrid :products="offers.map(o => o.product)" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Flame } from "lucide-vue-next";
import type { Offer } from "~/types";

const props = defineProps<{ offers: Offer[] }>();

const { target, isVisible } = useScrollReveal();

const flashOffer = computed(() => props.offers.find((o) => o.is_flash && o.end_date));

const countdown = ref({ hours: "00", minutes: "00", seconds: "00" });

function updateCountdown() {
  const offer = flashOffer.value;
  if (!offer?.end_date) return;
  const diff = Math.max(0, new Date(offer.end_date).getTime() - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  countdown.value = {
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
}

let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>
