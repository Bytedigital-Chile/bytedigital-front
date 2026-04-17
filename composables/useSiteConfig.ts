interface SiteConfig {
  id: number
  maintenance_mode: boolean
  maintenance_message: string | null
  whatsapp_number: string | null
  free_shipping_threshold: number | null
}

export function useSiteConfig() {
  const config = useState<SiteConfig | null>("site_config", () => null)
  const loading = useState<boolean>("site_config_loading", () => false)
  const { api } = useApi()

  async function fetchConfig() {
    if (loading.value) return
    loading.value = true
    try {
      config.value = await api<SiteConfig>("/site-config/")
    } catch {
      config.value = null
    } finally {
      loading.value = false
    }
  }

  const freeShippingThreshold = computed(() => config.value?.free_shipping_threshold ?? null)

  return { config, loading, fetchConfig, freeShippingThreshold }
}
