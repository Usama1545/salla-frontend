export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loadUser, isAuthenticated } = useUser();
  const localePath = useLocalePath();

  await loadUser();

  if (!isAuthenticated.value) {
    return navigateTo({
      path: localePath("/login"),
    });
  }
});
