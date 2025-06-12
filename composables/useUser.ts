type User = {
  id?: number;
  username?: string;
  email?: string;
  avatar?: string;
  language?: string;
  name?: string;
};

const initState = {
  id: null,
  username: null,
  email: null,
  avatar: null,
  language: "ar",
  name: "evotik_user",
};

const user = reactive<User>({ ...initState });
const prefix = "";

export default function () {
  const localePath = useLocalePath();
  const token = useCookie<string | undefined>("token", {
    maxAge: 60 * 60 * 24 * 30 * 1,
  });

  const setToken = async (newToken: string) => {
    token.value = newToken;
    refreshCookie("token");
    await loadUser();
  };

  const isAuthenticated = computed(() => {
    return Boolean(user.id);
  });

  /**
   * This would be used in middleware to check that the user is authenticate or not.
   */
  const loadUser = async () => {
    if (!token.value) {
      Object.assign(user, {});
      user.id = null;
    }
    return new Promise<User | null>(async (res, rej) => {
      const { data, error } = await useAPIFetch<{ data: User }>(
        `/api/user`,
        {},
        token.value
      );
      if (data.value) {
        Object.assign(user, data.value.data);
        res(user);
      }

      if (error.value) {
        Object.assign(user, {});
        if (error.value.statusCode == 401) {
          token.value = undefined;
        }
        res(null);
      }
      refreshCookie("token");
    });
  };

  const logout = async () => {
    return new Promise<void>(async (res, rej) => {
      // @ts-ignore
      // window.Echo.private(`App.Models.User.${user.id}`).stopListening(".user.notifications");

      await useAPIFetch(`/${prefix}/logout`, { method: "POST" }, token.value);

      token.value = null;
      Object.assign(user, initState);

      res();
      refreshCookie("token");

      await navigateTo(localePath(`/login`));
    });
  };

  const avatar = computed(() => {
    return (
      user.avatar ??
      `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`
    );
  });

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    loadUser,
    logout,
    avatar,
  };
}
