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

const { config } = useSiteConfig()
const { api } = useApi()

// Poll every 5 seconds to check if maintenance is still active
let interval: ReturnType<typeof setInterval> | null = null

async function checkMaintenance() {
  try {
    const data = await api<{ maintenance_mode: boolean }>("/site-config/")
    if (!data.maintenance_mode) {
      // Maintenance is off, redirect to home
      if (interval) clearInterval(interval)
      await navigateTo("/", { replace: true })
    }
  } catch {
    // If error, keep polling
  }
}

onMounted(() => {
  // Check immediately in case it was already disabled
  checkMaintenance()
  // Then poll every 5 seconds
  interval = setInterval(checkMaintenance, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const message = computed(() =>
  config.value?.maintenance_message || "Estamos mejorando el sitio. Volvemos pronto."
)

useHead({
  title: "Sitio en Mantenimiento - ByteDigital",
})
</script>
