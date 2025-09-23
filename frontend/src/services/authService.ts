import { apiRequest } from "./apiClient";
import { type LoginPayload, type LoginResponse } from "@/types/auth";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return await apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
