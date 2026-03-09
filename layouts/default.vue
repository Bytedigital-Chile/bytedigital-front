<template>
  <div class="min-h-screen flex flex-col">
    <LayoutTheHeader />
    <LayoutCategoryNav />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutTheFooter />
    <LayoutToastContainer />
    <LayoutWhatsAppButton />
  </div>
</template>

<script setup lang="ts">
const { config, fetchConfig } = useSiteConfig()

// Ensure site config is loaded for WhatsApp button
if (!config.value) {
  await fetchConfig()
}
</script>
