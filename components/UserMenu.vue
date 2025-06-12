<script setup lang="ts">
import { is } from "@babel/types";
import type { DropdownMenuItem } from "@nuxt/ui";
const { user, isAuthenticated } = useUser();
defineProps<{
  collapsed?: boolean;
}>();

console.log(isAuthenticated);
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: "label",
      label: user.value?.name,
      avatar: user.value?.avatar,
    },
    {
      label: isDark.value ? "Light" : "Dark",
      icon: isDark.value ? "i-lucide-sun" : "i-lucide-moon",
      type: "checkbox",
      onUpdateChecked(checked: boolean) {
        isDark.value = !isDark.value;
      },
      onSelect(e: Event) {
        e.preventDefault();
      },
    },
  ],
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
    },
  ],
  [
    {
      label: "Log out",
      icon: "i-lucide-log-out",
    },
  ],
]);
</script>

<template>
  <div class="w-full">
    <UDropdownMenu
      v-if="isAuthenticated"
      :items="items"
      :content="{ align: 'center', collisionPadding: 12 }"
      class="w-full"
      :ui="{
        content: 'w-full',
      }"
    >
      <div class="flex items-center gap-2 w-full">
        <UButton
          v-bind="{
            ...user,
            label: collapsed ? undefined : user?.name,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
          }"
          color="neutral"
          variant="ghost"
          block
          :square="collapsed"
          class="w-full border border-gray-300 rounded-md data-[state=open]:bg-elevated"
          :ui="{
            trailingIcon: 'text-dimmed',
          }"
        />
      </div>
    </UDropdownMenu>

    <div v-else class="flex items-center gap-2 w-full">
      <UButton
        label="Sign in"
        color="neutral"
        variant="ghost"
        block
        @click.prevent="navigateTo('/login')"
        class="w-full border border-gray-300 rounded-md"
      />
    </div>
  </div>
</template>
