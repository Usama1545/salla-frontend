<template>
  <div
    v-if="!maxFiles || (maxFiles && validMediaLength < maxFiles)"
    v-bind="$attrs"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDroppedFiles"
    :class="[
      dragging ? 'border-primary' : 'border-gray-400 dark:border-gray-600',
      'border border-dashed flex items-center justify-center flex-col py-3 rounded-md h-[190px]',
    ]"
  >
    <UIcon class="text-3xl" name="i-heroicons-photo" />
    <span class="text-base">{{ $t("drop_files_label") }}</span>
    <template v-if="!hideSelectButton">
      <span class="text-xs mb-1">{{ $t("or") }}</span>
      <div class="flex items-center gap-x-1">
        <UButton
          :loading="isLoading"
          color="gray"
          icon="i-heroicons-plus-20-solid"
          size="xs"
          @click.prevent="input.click()"
        >
          {{ $t("select_file") }}
        </UButton>
      </div>
    </template>
    <input
      type="file"
      multiple
      class="hidden"
      ref="input"
      @input.prevent="onSelectedFiles"
    />
    <span class="block text-center text-xs m-1" v-if="maxFiles">
      {{ $t("max_file_to_upload", { count: maxFiles }) }}
    </span>
  </div>

  <UModal
    v-model="mediaModalOpened"
    :ui="{
      width: 'sm:max-w-6xl',
    }"
  >
    <PartialsMediaSelector
      :is-multi="true"
      @select-image-file="
        (file) => {
          updateSelectedFiles(file);

          mediaModalOpened = false;
        }
      "
    />
  </UModal>
</template>

<script setup lang="ts">
interface IProps {
  maxFiles?: number;
  maxFileSize?: number;
  fileType?: string;
  directory?: string | undefined;
  hideSelectButton?: boolean;
  modelValue: any[];
  model_id?: any;
  model_type?: any;
}

const props = withDefaults(defineProps<IProps>(), {
  maxFiles: undefined,
  fileType: undefined,
  hideSelectButton: false,
  model_id: null,
  model_type: null,
});

const toast = useToast();
const { t } = useI18n();
const emit = defineEmits(["update:modelValue"]);
const dragging = ref(false);
const input = ref<HTMLInputElement | null>();
const { isLoading } = useIsLoading();
const mediaModalOpened = ref(false);

const media = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const allowedTypes = computed(() => {
  const typeByFileType: {
    [key: string]: string[];
  } = {
    image: ["image/jpeg", "image/png", "image/gif"],
    video: ["video/mp4", "video/webm", "video/ogg"],
  };

  return props.fileType ? typeByFileType[props.fileType] : [];
});

const validMediaLength = computed(() => {
  if (!media.value) return 0;

  return media.value.filter((item) => !item.error).length ?? 0;
});

function separateValidImages(files: File[]): {
  validFiles: File[];
  invalidFiles: File[];
} {
  const { validFiles, invalidFiles } = files.reduce(
    (acc, file) => {
      if (
        allowedTypes.value.length === 0 ||
        (file.type !== "" && allowedTypes.value.includes(file.type))
      ) {
        acc.validFiles.push(file);
      } else {
        acc.invalidFiles.push(file);
      }
      return acc;
    },
    { validFiles: [] as File[], invalidFiles: [] as File[] }
  );

  return { validFiles, invalidFiles };
}

const uploadFiles = (files: File[]) => {
  const { validFiles, invalidFiles } = separateValidImages(files);

  invalidFiles.map((file) =>
    toast.add({
      title: t("invalid_file"),
      description: t("invalid_file_type", {
        name: file.name,
        type: file.type,
      }),
      color: "rose",
    })
  );

  if (props.maxFiles && validMediaLength.value >= props.maxFiles) {
    return;
  }

  const remainingSlots = props.maxFiles
    ? props.maxFiles - validMediaLength.value
    : Infinity;

  const filesToUpload = validFiles.slice(0, remainingSlots);

  filesToUpload.forEach(async (file, index) => {
    // Upload process should be done here...
    const response = await uploadFile(
      file,
      props.directory,
      props.model_type,
      props.model_id
    );
    media.value.push(response);
  });
};

const onDroppedFiles = (event: DragEvent) => {
  dragging.value = false;

  if (!event.dataTransfer?.items) return;

  let files: File[] = [...event.dataTransfer?.items]
    .filter((item) => item.kind == "file")
    .map((item) => item.getAsFile()) as File[];

  uploadFiles(files);
};

const onSelectedFiles = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target || !target.files) return;

  let files = [...target.files];

  uploadFiles(files);
};

defineExpose({
  uploadFiles,
});

const updateSelectedFiles = async (file: any) => {
  if (Array.isArray(file)) {
    media.value.push(...file);
  } else {
    media.value.push(file);
  }
};
</script>
