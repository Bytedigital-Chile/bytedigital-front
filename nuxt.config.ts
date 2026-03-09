export default defineNuxtConfig({
  modules: ["shadcn-nuxt", "@nuxtjs/tailwindcss"],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  devtools: { enabled: true },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || "http://localhost:8000",
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    },
  },
  compatibilityDate: "2025-01-01",
  app: {
    head: {
      title: "ByteDigital - Tecnología al mejor precio",
      meta: [
        { name: "description", content: "Tienda de tecnología y computación en Chile" },
      ],
      htmlAttrs: { lang: "es" },
      script: [
        { src: "https://accounts.google.com/gsi/client", async: true, defer: true },
      ],
    },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || "node-server",
  },
});
