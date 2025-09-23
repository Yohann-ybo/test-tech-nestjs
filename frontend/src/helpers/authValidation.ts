import type { LoginForm } from "../types/auth";

export interface LoginFormErrors {
  email: string;
  password: string;
}

export const AUTH_VALIDATION_LIMITS = {
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MIN_LENGTH: 3,
  PASSWORD_MAX_LENGTH: 128,
} as const;

export class AuthValidator {
  static validateEmail(email: string): string {
    if (!email.trim()) {
      return "L'email est requis";
    }

    if (email.length > AUTH_VALIDATION_LIMITS.EMAIL_MAX_LENGTH) {
      return `L'email ne peut pas dépasser ${AUTH_VALIDATION_LIMITS.EMAIL_MAX_LENGTH} caractères`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Veuillez entrer une adresse email valide";
    }

    return "";
  }

  static validatePassword(password: string): string {
    if (!password.trim()) {
      return "Le mot de passe est requis";
    }

    if (password.length < AUTH_VALIDATION_LIMITS.PASSWORD_MIN_LENGTH) {
      return `Le mot de passe doit contenir au moins ${AUTH_VALIDATION_LIMITS.PASSWORD_MIN_LENGTH} caractères`;
    }

    if (password.length > AUTH_VALIDATION_LIMITS.PASSWORD_MAX_LENGTH) {
      return `Le mot de passe ne peut pas dépasser ${AUTH_VALIDATION_LIMITS.PASSWORD_MAX_LENGTH} caractères`;
    }

    return "";
  }

  static validateLoginForm(loginForm: LoginForm): LoginFormErrors {
    return {
      email: this.validateEmail(loginForm.email),
      password: this.validatePassword(loginForm.password),
    };
  }

  static hasErrors(errors: LoginFormErrors): boolean {
    return Object.values(errors).some((error) => error !== "");
  }
}
