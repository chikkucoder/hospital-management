import { apiRequest } from "./api";

export const authService = {
  login: (credentials) => apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  getMe: () => apiRequest("/auth/me"),
};
