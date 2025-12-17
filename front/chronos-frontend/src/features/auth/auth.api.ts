import { api } from "@/lib/api";

export type LoginResponse = {
  token: string;
};

/**
 * Login user and store JWT
 */
export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", res.data.token);
  return res.data;
}

/**
 * Signup new user
 */
export async function signup(email: string, password: string) {
  const res = await api.post("/auth/signup", {
    email,
    password,
  });
  return res.data;
}

/**
 * Logout user
 */
export function logout() {
  localStorage.removeItem("token");
}

/**
 * Request password reset
 * Always returns success to avoid user enumeration
 */
export async function forgotPassword(email: string) {
  await api.post("/auth/forgot", { email });
}