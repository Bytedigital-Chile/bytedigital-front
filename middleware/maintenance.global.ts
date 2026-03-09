export default defineNuxtRouteMiddleware(async (to) => {
  // Don't block the maintenance page itself
  if (to.path === "/mantenimiento") return

  const { fetchConfig, config } = useSiteConfig()

  // Always fetch fresh config to check maintenance status
  await fetchConfig()

  // Redirect to maintenance page if mode is active
  if (config.value?.maintenance_mode) {
    return navigateTo("/mantenimiento")
  }
})
