import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { navigateToLogin, navigateToHome } from "../router";
import type { User, AuthState } from "../types/auth";

const authState = reactive<AuthState>({
  isAuthenticated: false,
  user: null,
});

const isLoading = ref<boolean>(false);
const error = ref<string>("");

const STORAGE_KEYS = {
  AUTH: "isAuthenticated",
  USER: "userData",
  TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export function useAuth() {
  const router = useRouter();

  const isAuthenticated = computed(() => authState.isAuthenticated);
  const user = computed(() => authState.user);
  const isLoggedIn = computed(
    () => authState.isAuthenticated && authState.user !== null
  );

  const login = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = "";

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!email || !password) {
        throw new Error("Email et mot de passe requis");
      }

      const userData: User = {
        id: Date.now().toString(),
        email: email,
        name: getUserNameFromEmail(email),
      };

      localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      authState.isAuthenticated = true;
      authState.user = userData;

      const route = router.currentRoute.value;
      const redirectPath = route.query.redirect as string;

      if (redirectPath) {
        await router.push(redirectPath);
      } else {
        await navigateToHome();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Échec de la connexion";
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true;

      clearStorage();
      clearAuthState();

      await navigateToLogin();
    } catch (err) {
      console.error("Logout error:", err);
      // Force clear even if navigation fails
      clearStorage();
      clearAuthState();
      // Fallback navigation
      window.location.href = "/login";
    } finally {
      isLoading.value = false;
    }
  };

  const clearAuthState = (): void => {
    authState.isAuthenticated = false;
    authState.user = null;
    error.value = "";
  };

  const clearStorage = (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const getUserNameFromEmail = (email: string): string => {
    const username = email.split("@")[0];
    if (!username) return "Default";
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return {
    // State
    isAuthenticated,
    user,
    isLoggedIn,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Methods
    login,
    logout,
    clearStorage,
  };
}
