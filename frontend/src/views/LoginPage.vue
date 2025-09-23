<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white shadow-xl rounded-lg p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Bienvenue</h2>
          <p class="text-gray-600">Veuillez vous connecter à votre compte</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <BaseInput
            id="email"
            v-model="loginForm.email"
            label="Adresse Email"
            type="email"
            :maxlength="EMAIL_MAX_LENGTH"
            :error="errors.email"
            placeholder="you@example.com"
            required
          />

          <BaseInput
            id="password"
            v-model="loginForm.password"
            label="Mot de passe"
            type="password"
            :maxlength="PASSWORD_MAX_LENGTH"
            :error="errors.password"
            placeholder="••••••••"
            required
          />

          <div
            v-if="globalError"
            class="bg-red-50 border border-red-200 rounded-md p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <BaseIcon name="error" size="md" class="text-red-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ globalError }}</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              :class="submitButtonClasses"
            >
              <BaseIcon
                v-if="isLoading"
                name="spinner"
                size="md"
                class="animate-spin -ml-1 mr-3"
              />
              {{ submitButtonText }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { BUTTON_CLASSES } from "@/constants/styles";
import {
  AUTH_VALIDATION_LIMITS,
  AuthValidator,
} from "@/helpers/authValidation";
import type { LoginForm, LoginFormErrors } from "@/types/auth";
import { reactive, computed, watch } from "vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseIcon from "@/components/common/BaseIcon.vue";

const { login, isLoading, error: authError } = useAuth();

const { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } = AUTH_VALIDATION_LIMITS;

const loginForm = reactive<LoginForm>({
  email: "",
  password: "",
});

const errors = reactive<LoginFormErrors>({
  email: "",
  password: "",
});

const globalError = computed(() => authError.value);

const submitButtonText = computed(() => {
  return isLoading.value ? "Connexion..." : "Se connecter";
});

const submitButtonClasses = computed(() => {
  const baseClasses = BUTTON_CLASSES.PRIMARY;
  const disabledClasses = isLoading.value ? BUTTON_CLASSES.DISABLED : "";
  return `${baseClasses} ${disabledClasses}`;
});

watch(
  () => loginForm.email,
  (newEmail) => {
    errors.email = AuthValidator.validateEmail(newEmail);
  }
);

watch(
  () => loginForm.password,
  (newPassword) => {
    errors.password = AuthValidator.validatePassword(newPassword);
  }
);

const handleLogin = async (): Promise<void> => {
  const formErrors = AuthValidator.validateLoginForm(loginForm);

  if (AuthValidator.hasErrors(formErrors)) {
    return;
  }

  try {
    await login(loginForm.email, loginForm.password);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>
