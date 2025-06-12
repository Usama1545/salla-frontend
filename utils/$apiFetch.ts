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
  success: "primary",
  error: "red",
};

export default function <T>(
  path: any,
  options = {},
  externalToken: string | null = null
) {
  const { startLoading, stopLoading } = useIsLoading();
  const { $i18n } = useNuxtApp();
  const { t, locale } = $i18n;
  const toast = useToast();
  const route = useRoute();

  const currency = useCookie<string | undefined>("currency");
  const token =
    useCookie<string | null>("token").value || useCookie("visitor_token").value;
  const dashboardToken = useCookie<string | null>("dashboard_token").value;
  const config = useRuntimeConfig();
  const inLoginView = computed(() => route.path.includes("login"));

  let headers: Record<string, any> = {
    Authorization: `Bearer ${
      path.includes("dashboard") && !inLoginView.value
        ? dashboardToken
        : externalToken ?? token
    }`,
    Language: locale.value,
    "X-Requested-With": "XMLHttpRequest",
    ...useRequestHeaders(["cookie", "x-forwarded-for"]),
    ...options.headers,
  };

  if (currency.value) {
    headers["Currency"] = currency.value;
  }
  const toastTitles = {
    success: t("success"),
    error: t("error"),
  };
  options = {
    baseURL: config.public.base_api_url,
    headers,
    async onRequest() {
      await startLoading();
    },
    async onRequestError() {
      await stopLoading();
    },
    async onResponse({ response }) {
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
    ...options,
  };

  return $fetch<T>(path, options);
}
