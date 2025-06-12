<script setup lang="ts">
import { watchEffect } from "vue";

const { setToken } = useUser();
const route = useRoute();

const triggerCallback = async () => {
  const queryParams = route.query;

  if (!queryParams || Object.keys(queryParams).length === 0) {
    console.log("No query params found yet");
    return;
  }

  const { data } = await useAPIFetch("/api/oauth/callback", {
    method: "GET",
    params: queryParams,
  });

  const accessToken = data.value?.data?.user?.token?.access_token;
  if (accessToken && accessToken.length > 0) {
    setToken(accessToken);
  } else {
    console.log("Access token not found in response", data.value);
  }
};

watchEffect(() => {
  if (Object.keys(route.query).length > 0) {
    triggerCallback();
  }
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        class="dark:text-white dark:bg-gray-500 bg-gray-100"
        title="Products"
        :badge="0"
      ></UDashboardNavbar>
      <div
        class="flex flex-col items-center justify-center align-center text-center my-auto"
      >
        <h1 class="text-3xl font-bold mb-2">Salla Auth Processing</h1>
        <p class="text-gray-600 mb-6">Callback received</p>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
