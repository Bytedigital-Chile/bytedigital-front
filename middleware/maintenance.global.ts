export default defineNuxtRouteMiddleware(async (to) => {
  // Don't block the maintenance page itself
  if (to.path === "/mantenimiento") return

  const { config, fetchConfig } = useSiteConfig()

  // Fetch config if not loaded yet
  if (!config.value) {
    await fetchConfig()
  }

  // Redirect to maintenance page if mode is active
  if (config.value?.maintenance_mode) {
    return navigateTo("/mantenimiento")
  }
})
