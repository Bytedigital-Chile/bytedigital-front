<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center max-w-md">
      <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Wrench class="w-10 h-10 text-blue-600" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-3">Sitio en Mantenimiento</h1>
      <p class="text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wrench } from "lucide-vue-next"

definePageMeta({
  layout: false,
})

const { config, fetchConfig } = useSiteConfig()

// Ensure config is loaded
if (!config.value) {
  await fetchConfig()
}

const message = computed(() =>
  config.value?.maintenance_message || "Estamos mejorando el sitio. Volvemos pronto."
)

useHead({
  title: "Sitio en Mantenimiento - ByteDigital",
})
</script>
