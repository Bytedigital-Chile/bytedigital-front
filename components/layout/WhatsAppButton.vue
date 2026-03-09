<template>
  <a
    v-if="whatsappUrl"
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-colors"
    aria-label="Contactar por WhatsApp"
  >
    <MessageCircle class="w-6 h-6" />
  </a>
</template>

<script setup lang="ts">
import { MessageCircle } from "lucide-vue-next"

const { config } = useSiteConfig()

const whatsappUrl = computed(() => {
  const number = config.value?.whatsapp_number
  if (!number) return null
  // Remove any non-digit characters except +
  const clean = number.replace(/[^\d+]/g, "").replace(/^\+/, "")
  return `https://wa.me/${clean}?text=${encodeURIComponent("Hola, vengo desde ByteDigital")}`
})
</script>
