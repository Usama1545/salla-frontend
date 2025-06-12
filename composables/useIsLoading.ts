const isLoading = ref(false);

export default function () {
  function startLoading() {
    return new Promise<void>((res, rej) => {
      if (process.server) {
        return res();
      }
      isLoading.value = true;
      res();
    });
  }

  function stopLoading() {
    return new Promise<void>((res, rej) => {
      if (process.server) {
        return res();
      }
      isLoading.value = false;
      res();
    });
  }

  return { isLoading, startLoading, stopLoading };
}
