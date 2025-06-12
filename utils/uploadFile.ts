import $apiFetch from "./$apiFetch";
export default function <T>(
  file: File,
  dir: string | null = null,
  modelType = null,
  modelId = null
) {
  const formData = new FormData();

  if (modelType) {
    formData.append("model_type", modelType);
  }

  if (modelId) {
    formData.append("model_id", modelId);
  }

  if (dir) {
    formData.append("directory", dir);
  }

  formData.append("files", file);

  return $apiFetch<T>("/api/uploads", {
    method: "POST",
    body: formData,
  });
}
