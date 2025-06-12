<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
definePageMeta({
  middleware: "auth",
});
const { t } = useI18n();

const open = ref(false);
const isloading = useIsLoading();
const URL = "/api/popups";
const { data, refresh } = await useAPIFetch(`${URL}`);
const items = ref([
  { value: "text", label: t("text") },
  { value: "image", label: t("image") },
]);
const image = ref([]);
const state = reactive({
  title: "",
  type: "",
  content: "",
  cta: {
    text: "",
    link: "",
    color: "",
  },
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title) errors.push({ name: "title", message: "Required" });
  if (!state.type) errors.push({ name: "type", message: "Required" });
  if (!state.content && state.type === "text")
    errors.push({ name: "content", message: "Required" });
  if (!state.cta.text) errors.push({ name: "cta_text", message: "Required" });
  if (!state.cta.link) errors.push({ name: "cta_link", message: "Required" });
  if (!state.cta.color) errors.push({ name: "cta_color", message: "Required" });

  return errors;
};

const columns = [
  {
    accessorKey: "actions",
    header: t("actions"),
  },
  {
    accessorKey: "title",
    header: t("title"),
  },
  {
    accessorKey: "content",
    header: t("content"),
  },
  {
    accessorKey: "cta.text",
    header: t("cta_text"),
  },
  {
    accessorKey: "cta.link",
    header: t("cta_link"),
  },
];

const editPopup = async (id: number) => {
  console.log(id);
  const { data: popup } = await useAPIFetch(`${URL}/${id}`);
  state.title = popup.value.title;
  state.type = popup.value.type;
  state.content = popup.value.content;
  state.cta.text = popup.value.cta.text;
  state.cta.link = popup.value.cta.link;
  state.cta.color = popup.value.cta.color;
  image.value = popup.value.upload ?? [];
  open.value = true;
};

const deletePopup = async (id: number) => {
  const { error } = await useAPIFetch(`${URL}/${id}`, { method: "DELETE" });
  if (!error.value) refresh();
};

const actions = (row) => [
  [
    {
      label: t("edit"),
      icon: "humbleicons:pencil",
      onSelect: () => {
        console.log(row.original.id);
        editPopup(row.original.id);
      },
    },
    {
      label: t("delete"),
      icon: "humbleicons:trash",
      onSelect: () => {
        console.log(row.original.id);
        deletePopup(row.original.id);
      },
    },
  ],
];

const onSubmit = async () => {
  const { error } = await useAPIFetch(`${URL}`, {
    method: "POST",
    body: {
      title: state.title,
      type: state.type,
      account_id: 1,
      marketplace_id: 1,
      content: state.content,
      cta: state.cta,
      image: image.value,
    },
    watch: false,
  });

  if (!error.value) {
    refresh();
    open.value = false;
  }
};
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Popup" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            color="primary"
            variant="solid"
            size="md"
            label="create"
            @click.prevent="open = true"
            trailing-icon="i-heroicons-plus-20-solid"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTable :data="data.data" :columns="columns" class="flex-1">
        <template #actions-cell="{ row }">
          <UDropdownMenu
            :popper="{
              strategy: 'absolute',
              placement: 'bottom-start',
            }"
            :items="actions(row)"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-vertical-20-solid"
            />
          </UDropdownMenu>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
  <UModal
    v-model:open="open"
    :title="$t('create_popup')"
    close-icon="i-lucide-x"
  >
    <template #body>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4 w-full"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormField
            :label="$t('title')"
            name="title"
            class="col-span-2 w-full"
          >
            <UInput v-model="state.title" class="w-full" />
          </UFormField>
          <UFormField
            :label="$t('content_type')"
            name="title"
            class="col-span-2 w-full"
          >
            <USelectMenu
              v-model="state.type"
              :items="items"
              class="w-full"
              label-key="label"
              value-key="value"
            />
          </UFormField>

          <UFormField
            v-if="state.type === 'text'"
            label="Content"
            name="content"
            class="col-span-2 w-full"
          >
            <UInput v-model="state.content" class="w-full" />
          </UFormField>

          <UFormField
            v-if="state.type === 'image'"
            label="Content"
            name="content"
            class="col-span-2 w-full"
          >
            <ImagePreview
              v-model="image"
              :max-files="1"
              model_type="App\Models\Popup"
              file-type="image"
            />
          </UFormField>

          <hr class="col-span-2" />

          <UFormField
            :label="$t('cta_text')"
            name="cta_text"
            class="col-span-2 w-full"
          >
            <UInput v-model="state.cta.text" class="w-full" />
          </UFormField>
          <UFormField
            :label="$t('cta_link')"
            name="cta_link"
            class="col-span-2 w-full"
          >
            <UInput v-model="state.cta.link" class="w-full" />
          </UFormField>
          <UFormField
            :label="$t('cta_color')"
            name="cta_color"
            class="col-span-2 w-full border-gray-400 dark:border-gray-600"
          >
            <UInput v-model="state.cta.color" class="w-12" type="color" />
          </UFormField>
        </div>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </template>
  </UModal>
</template>
