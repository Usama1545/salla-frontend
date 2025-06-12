<script setup lang="ts">
import type { FormError } from "#ui/types";

const route = useRoute();
const handleLoginClick = async () => {
  const { data } = await useAPIFetch("/api/oauth/redirect");

  window.location.href = data.value.url;
};
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Login" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div
        class="flex flex-col items-center justify-center align-center text-center my-auto"
      >
        <h1 class="text-3xl font-bold mb-2">Salla auth Platform</h1>
        <p class="text-gray-600 mb-6">Login to your salla account</p>

        <UButton color="primary" size="lg" @click="handleLoginClick">
          Login
        </UButton>
      </div>
    </template>
  </UDashboardPanel>
</template>
