<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const { loadUser } = useUser();

await loadUser();

const { t } = useI18n();

const open = ref(false);

const links = [
  [
    {
      label: "Home",
      icon: "i-lucide-house",
      to: "/",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Popup",
      icon: "i-lucide-activity",
      to: "/popup",
      onSelect: () => {
        open.value = false;
      },
    },
  ],
] satisfies NavigationMenuItem[][];

const groups = computed(() => []);
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <img
          src="/public/favicon.ico"
          :collapsed="collapsed"
          class="h-5 w-auto shrink-0"
        />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <div class="w-full">
          <UDashboardSearchButton
            :collapsed="collapsed"
            class="bg-transparent ring-default mb-3 w-full border-gray-200"
          />
          <UserMenu :collapsed="collapsed" class="w-full" />
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
  </UDashboardGroup>
</template>
