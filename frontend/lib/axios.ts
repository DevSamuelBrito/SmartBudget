import axios, { type AxiosError } from "axios";

type ApiErrorPayload = {
  detail?: string;
  error?: string;
  message?: string;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
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
