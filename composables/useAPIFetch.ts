import type { NotificationColor } from "#ui/types";

const httpErrorCodes = {
  unauthorized: 403,
  // unauthenticated: 401,
  validation_error: 422,
  too_many_attempts: 429,
  server_error: 500,
  not_found: 404,
};

const toastColor: {
  [key: string]: NotificationColor;
} = {
  // success: "emerald",
  success: "primary",
  error: "red",
};

export default function <T>(
  path: string,
  options: any = {},
  externalToken: string | null = null
) {
  let locale = ref(),
    t = null;

  if (useNuxtApp().$i18n) {
    const { $i18n } = useNuxtApp();
    locale.value = $i18n.locale.value;
    t = $i18n.t;
  }

  const route = useRoute();
  const { startLoading, stopLoading } = useIsLoading();
  const toast = useToast();

  const toastTitles = {
    success: t ? t("success") : null,
    error: t ? t("error") : null,
  };

  const config = useRuntimeConfig();
  const token =
    useCookie<string | null>("token").value || useCookie("visitor_token").value;
  const dashboardToken = useCookie<string | null>("dashboard_token").value;
  const currency = useCookie<string | undefined>("currency");
  const inLoginView = computed(() => route.path.includes("login"));

  let headers: Record<string, any> = {
    Authorization: `Bearer ${
      route.path.includes("dashboard") && !inLoginView.value
        ? dashboardToken
        : externalToken ?? token
    }`,
    Language: locale.value,
    "X-Requested-With": "XMLHttpRequest",
    ...useRequestHeaders(["cookie", "x-forwarded-for"]),
  };

  if (currency.value) {
    headers["Currency"] = currency.value;
  }

  options = {
    ...options,
    baseURL: config.public.base_api_url,
    headers,
    async onRequest() {
      await startLoading();
    },
    async onRequestError() {
      await stopLoading();
    },
    async onResponse({ response }: any) {
      await stopLoading();

      if (response.status == 401) return;

      const { message: description } = response._data;

      if (description) {
        const title = Object.values(httpErrorCodes).includes(response.status)
          ? toastTitles.error
          : toastTitles.success;
        const color = Object.values(httpErrorCodes).includes(response.status)
          ? toastColor.error
          : toastColor.success;

        toast.add({
          description,
          color,
        });
      }
    },
    async onResponseError() {
      await stopLoading();
    },
  };

  return useFetch<T>(path, options);
}
