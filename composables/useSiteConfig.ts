interface SiteConfig {
  id: number
  maintenance_mode: boolean
  maintenance_message: string | null
  whatsapp_number: string | null
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

  return { config, loading, fetchConfig }
}
