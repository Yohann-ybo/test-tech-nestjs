export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email: string;
  password: string;
}

export interface User {
  email: string;
  name?: string | null;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const STORAGE_KEYS = {
  AUTH: "isAuthenticated",
  USER: "userData",
  TOKEN: "authToken",
} as const;
