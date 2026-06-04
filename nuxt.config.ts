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
      facebookAppId: process.env.NUXT_PUBLIC_FACEBOOK_APP_ID || "",
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
      // B-6: Google/Facebook SDKs are loaded lazily only on the pages that need
      // them (login, account security), not globally on every page.
    },
  },
  // B-6: Content-Security-Policy (defense in depth vs XSS) + frame protection.
  routeRules: {
    "/**": {
      headers: {
        "Content-Security-Policy": [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://accounts.google.com https://connect.facebook.net",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://api.bytedigital.cl https://accounts.google.com https://graph.facebook.com",
          "frame-src https://accounts.google.com https://www.facebook.com https://connect.facebook.net",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || "node-server",
  },
});
