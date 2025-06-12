<template>
  <div
    ref="container"
    class="grid"
    dir="ltr"
    :class="[maxFiles == 1 ? 'grid-cols-1' : 'sm:grid-cols-2 gap-2 mb-2', custom_classes]"
    :style="{ direction: 'ltr' }">
    <div
      v-for="(image, index) in localImages"
      class="bg-no-repeat bg-cover bg-center border cursor-pointer relative"
      :key="image.id"
      :class="height">
      <img :src="image.url" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" loading="lazy" />
      <UTooltip class="absolute start-2 top-2 z-10">
        <UButton
          icon="i-heroicons-trash"
          variant="soft"
          size="xs"
          :loading="isLoading"
          @click.prevent="deleteImage(image.id, index)" />
      </UTooltip>

      <div v-if="sortable" class="absolute end-2 top-2 z-10">
        <UButton
          :icon="index == 0 ? 'i-mdi-star' : 'proicons:arrow-move'"
          :color="index == 0 ? 'green' : 'gray'"
          :variant="index == 0 ? 'solid' : 'soft'"
          size="xs"
          :loading="isLoading" />
      </div>
    </div>
  </div>

  <FormsDragAndDrop
    v-model="images"
    :model_type="model_type"
    :hide-select-button="hideSelectButton"
    :model_id="model_id"
    :file-type="fileType"
    :max-files="maxFiles"
    :directory="directory"
    :class="height" />
</template>

<script setup lang="ts">
import { useSortable } from "@vueuse/integrations/useSortable";

interface IProps {
  maxFiles?: number;
  maxFileSize?: number;
  fileType?: string;
  hideSelectButton?: boolean;
  modelValue: any[];
  model_id?: any;
  model_type?: any;
  height?: string;
  directory?: string | undefined;
  sortable?: boolean;
  custom_classes?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  maxFiles: undefined,
  fileType: undefined,
  hideSelectButton: false,
  model_id: null,
  model_type: null,
  height: "!h-36",
});

const { isLoading } = useIsLoading();
const emit = defineEmits(["update:modelValue", "deleted"]);

const container = ref<HTMLElement | null>(null);
const localImages = ref<any[]>([]);

const images = computed({
  get: () => props.modelValue,
  set: (_val) => emit("update:modelValue", _val),
});

watch(
  () => props.modelValue,
  function () {
    localImages.value = props.modelValue;
  },
  { immediate: true, deep: true },
);

watch(
  localImages,
  function () {
    useSortable(container, localImages, { animation: "200" });

    emit("update:modelValue", localImages.value);
  },
  { immediate: true, deep: true },
);

const deleteImage = async (image_id: number, image_index: number) => {
  if (image_id) {
    const { error } = await useAPIFetch(`/api/uploads/${image_id}`, { method: "DELETE" });
    if (error.value) return;
  }

  images.value.splice(image_index, 1);

  emit("deleted", { id: image_id, index: image_index });
};
</script>
