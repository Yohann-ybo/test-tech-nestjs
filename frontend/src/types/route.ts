export interface RouteMeta {
  requiresAuth?: boolean;
  requiresGuest?: boolean;
  title?: string;
  redirectTo?: string;
}

export const ROUTE_NAMES = {
  LOGIN: "Login",
  HOME: "Home",
  NOT_FOUND: "NotFound",
} as const;

export type RouteNameType = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];
