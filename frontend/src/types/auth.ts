export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
