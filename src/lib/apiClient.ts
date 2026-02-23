import { toast } from "sonner";

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  token?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const apiClient = async (endpoint: string, options: ApiOptions = {}) => {
  const { method = "GET", body, token } = options;
  const headers: HeadersInit = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    toast.error(error.message)
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};
