<script setup lang="ts">
const { user, isAuthenticated } = useUser();
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right> </template>
      </UDashboardNavbar>
    </template>

    <template #body> </template>
  </UDashboardPanel>
</template>
