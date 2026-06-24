import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

type ApiErrorPayload = {
  detail?: string;
  error?: string;
  message?: string;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<boolean> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = axios
          .post("/api/auth/refresh", null, { withCredentials: true })
          .then(() => true)
          .catch(() => false)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const refreshed = await refreshPromise;

      if (refreshed) {
        
        return api(originalRequest);
      }
    }

    const apiMessage =
      error.response?.data?.detail ??
      error.response?.data?.error ??
      error.response?.data?.message;

    if (apiMessage) {
      error.message = apiMessage;
    }

    return Promise.reject(error);
  },
);
