// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui-pro", "@vueuse/nuxt", "@nuxtjs/i18n"],

  devtools: {
    enabled: true,
  },
  compatibilityDate: "2025-06-12",
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    vueI18n: fileURLToPath(new URL("./i18n.config.ts", import.meta.url)), // ✅ Fix path resolution
    strategy: "prefix_and_default",
    defaultLocale: "en",
    locales: [
      {
        name: "English",
        code: "en",
        language: "en-US",
        dir: "ltr",
      },
      {
        name: "العربية",
        code: "ar",
        language: "ar-SA",
        dir: "rtl",
      },
    ],
    bundle: {
      optimizeTranslationDirective: false, // 👈 explicitly disable
    },
    detectBrowserLanguage: false,
  },
  css: ["assets/css/main.css"],

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
  ui: {
    icons: ["heroicons"],
    themes: {
      default: "light",
    },
  },
  runtimeConfig: {
    public: {
      base_api_url: process.env.NUXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000",
      base_url: process.env.NUXT_PUBLIC_BASE_URL ?? "https://IMakeup.com/",
      app_env: process.env.NUXT_PUBLIC_APP_ENV ?? "production",
    },
  },
});
