import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import type { User, AuthState } from "../types/auth";

// Global auth state
const authState = reactive<AuthState>({
  isAuthenticated: false,
  user: null,
});

const isLoading = ref<boolean>(false);
const error = ref<string>("");

// Storage keys
const STORAGE_KEYS = {
  AUTH: "isAuthenticated",
  USER: "userData",
  TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export function useAuth() {
  const router = useRouter();

  // Computed properties
  const isAuthenticated = computed(() => authState.isAuthenticated);
  const user = computed(() => authState.user);
  const isLoggedIn = computed(
    () => authState.isAuthenticated && authState.user !== null
  );

  // Check if user is authenticated (on app initialization)
  const checkAuth = (): boolean => {
    try {
      const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH) === "true";
      const userData = localStorage.getItem(STORAGE_KEYS.USER);

      if (isAuth && userData) {
        authState.isAuthenticated = true;
        authState.user = JSON.parse(userData) as User;
        return true;
      } else {
        clearAuthState();
        return false;
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      clearAuthState();
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = "";

      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication - replace with real API call
      if (!email || !password) {
        throw new Error("Email et mot de passe requis");
      }

      // Simulate different user types based on email
      const userData: User = {
        id: Date.now().toString(),
        email: email,
        name: getUserNameFromEmail(email),
      };

      // Store auth data
      localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      // Update reactive state
      authState.isAuthenticated = true;
      authState.user = userData;

      // Navigate to home
      await router.push("/home");
    } catch (err) {
      console.error(`Échec de la connexion`, { err });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true;

      // Clear storage
      clearStorage();

      // Clear reactive state
      clearAuthState();

      // Navigate to login
      await router.push("/login");
    } catch (err) {
      console.error("Logout error:", { err });
    } finally {
      clearStorage();
      clearAuthState();
      isLoading.value = false;
    }
  };

  // Update user data
  const updateUser = (updatedUser: Partial<User>): void => {
    if (authState.user) {
      authState.user = { ...authState.user, ...updatedUser };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authState.user));
    }
  };

  // Refresh user data (simulate API call)
  const refreshUser = async (): Promise<void> => {
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error("User not authenticated");
      }

      isLoading.value = true;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock refreshed data
      const refreshedUser: User = {
        ...authState.user,
        name: `${authState.user.name} (Updated)`,
      };

      updateUser(refreshedUser);
    } catch (err) {
      console.error("Error refreshing user:", err);
      error.value = "Erreur lors de la mise à jour des données utilisateur";
    } finally {
      isLoading.value = false;
    }
  };

  // Clear authentication state
  const clearAuthState = (): void => {
    authState.isAuthenticated = false;
    authState.user = null;
    error.value = "";
  };

  // Clear all storage
  const clearStorage = (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  // Utility function to generate user name from email
  const getUserNameFromEmail = (email: string): string => {
    const username = email.split("@")[0];
    if (!username) return "Default name";
    return username?.charAt(0).toUpperCase() + username.slice(1);
  };

  // Initialize auth state on composable creation
  const initializeAuth = (): void => {
    checkAuth();
  };

  // Route guard helper
  const requireAuth = (): boolean => {
    if (!isAuthenticated.value) {
      router.push("/login");
      return false;
    }
    return true;
  };

  // Get user initial for avatar
  const getUserInitial = computed(() => {
    return authState.user?.name?.charAt(0).toUpperCase() || "U";
  });

  // Get welcome message
  const getWelcomeMessage = computed(() => {
    return authState.user?.name
      ? `Bienvenue, ${authState.user.name}!`
      : "Bienvenue!";
  });

  return {
    // State
    isAuthenticated,
    user,
    isLoggedIn,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Computed helpers
    getUserInitial,
    getWelcomeMessage,

    // Methods
    login,
    logout,
    checkAuth,
    updateUser,
    refreshUser,
    initializeAuth,
    requireAuth,
    clearAuthState,

    // Utilities
    STORAGE_KEYS,
  };
}
