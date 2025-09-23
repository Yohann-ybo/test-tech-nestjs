import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { navigateToLogin, navigateToHome } from "../router";
import {
  type User,
  type AuthState,
  type LoginPayload,
  STORAGE_KEYS,
} from "../types/auth";
import { authService } from "@/services";

const authState = reactive<AuthState>({
  isAuthenticated: false,
  user: null,
  token: null,
});

const isLoading = ref<boolean>(false);
const error = ref<string>("");

export function initializeAuth() {
  try {
    const storedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (storedAuth === "true" && storedUser && storedToken) {
      authState.isAuthenticated = true;
      authState.user = JSON.parse(storedUser);
      authState.token = storedToken;
    }
  } catch (err) {
    console.error("Error initializing auth state:", err);
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

export function useAuth() {
  const router = useRouter();

  const isAuthenticated = computed(() => authState.isAuthenticated);
  const user = computed(() => authState.user);
  const token = computed(() => authState.token);
  const isLoggedIn = computed(
    () => authState.isAuthenticated && authState.user !== null
  );

  const login = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = "";

      if (!email || !password) {
        throw new Error("Email et mot de passe requis");
      }

      const loginPayload: LoginPayload = { email, password };
      const response = await authService.login(loginPayload);

      const userData: User = {
        email: response.user.email,
        name: response.user.name || getUserNameFromEmail(response.user.email),
      };

      localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.access_token);

      authState.isAuthenticated = true;
      authState.user = userData;
      authState.token = response.access_token;

      const route = router.currentRoute.value;
      const redirectPath = route.query.redirect as string;

      if (redirectPath) {
        await router.push(redirectPath);
      } else {
        await navigateToHome();
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true;

      clearAuthState();

      await navigateToLogin();
    } catch (err) {
      console.error("Logout error:", err);
      clearStorage();
      clearAuthState();
      window.location.href = "/login";
    } finally {
      isLoading.value = false;
    }
  };

  const clearAuthState = (): void => {
    authState.isAuthenticated = false;
    authState.user = null;
    authState.token = null;
    error.value = "";
  };

  const clearStorage = (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const getUserNameFromEmail = (email: string): string => {
    const username = email.split("@")[0];
    if (!username) return "User";
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  const extractErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      if (
        err.message.includes("401") ||
        err.message.includes("Unauthorized") ||
        err.message.includes("Invalid credentials")
      ) {
        return "Email ou mot de passe incorrect";
      }
      return err.message;
    }
    return "Une erreur inattendue s'est produite";
  };

  const checkAuthStatus = (): boolean => {
    return !!(authState.token && authState.isAuthenticated);
  };

  return {
    isAuthenticated,
    user,
    token,
    isLoggedIn,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    login,
    logout,
    clearStorage,
    checkAuthStatus,
  };
}
