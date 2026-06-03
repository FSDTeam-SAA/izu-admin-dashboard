import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the access token from the NextAuth session to every request.
api.interceptors.request.use(async (config) => {
  // Only available in the browser; server-side callers pass the header manually.
  if (typeof window !== "undefined") {
    const session = await getSession();
    const token = session?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Sign the admin out automatically when the token expires / is rejected.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      signOut({ callbackUrl: "/login" });
    }
    return Promise.reject(error);
  }
);

/** Normalise an axios error into a readable message for toasts. */
export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message ||
      fallback
    );
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default api;
