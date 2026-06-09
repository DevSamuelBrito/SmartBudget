import axios from "axios";
import { MOCK_JWT_TOKEN } from "@/lib/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${MOCK_JWT_TOKEN}`;

  return config;
});
