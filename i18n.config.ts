// i18n.config.ts
import { messages } from "./lang";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  fallbackLocale: "ar",
  messages,
}));
