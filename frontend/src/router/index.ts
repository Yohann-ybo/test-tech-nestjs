import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import HomePage from "../views/HomePage.vue";
import NotFoundPage from "../views/NotFoundPage.vue";
import { ROUTE_NAMES, type RouteMeta } from "@/types/route";
import { useAuth } from "@/composables/useAuth";

const { clearStorage } = useAuth();

const routes: Array<RouteRecordRaw & { meta?: RouteMeta }> = [
  {
    path: "/",
    redirect: { name: "Login" },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      title: "Connexion",
      requiresGuest: true,
    },
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
    meta: {
      requiresAuth: true,
      title: "Todo list",
    },
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFoundPage,
    meta: {
      title: "Page non trouvée",
    },
  },
  // Catch-all route for 404 pages
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "NotFound" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const isAuthenticated = (): boolean => {
  try {
    const authFlag = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("userData");
    return authFlag === "true" && userData !== null;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const userIsAuthenticated = isAuthenticated();
    const requiresAuth = to.meta?.requiresAuth === true;
    const requiresGuest = to.meta?.requiresGuest === true;

    if (to.meta?.title) {
      document.title = `${to.meta.title} - Mon App`;
    }

    if (requiresAuth && !userIsAuthenticated) {
      console.warn("Access denied: Authentication required");
      clearStorage();
      next({
        name: "Login",
        query: {
          redirect: to.fullPath,
        },
      });
      return;
    }

    if (requiresGuest && userIsAuthenticated) {
      console.info("Already authenticated, redirecting to home");
      next({
        name: "Home",
      });
      return;
    }

    if (to.path === "/") {
      if (userIsAuthenticated) {
        next({ name: "Home" });
      } else {
        next({ name: "Login" });
      }
      return;
    }

    // Allow navigation
    next();
  }
);

export default router;

// Navigation helpers
export const navigateToHome = () => router.push({ name: ROUTE_NAMES.HOME });
export const navigateToLogin = () => router.push({ name: ROUTE_NAMES.LOGIN });
export const navigateTo404 = () => router.push({ name: ROUTE_NAMES.NOT_FOUND });
