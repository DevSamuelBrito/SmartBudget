//libs
import { api } from "@/lib/axios";

import type { CategoryApi } from "../types";

type CreateCategoryRequest = {
  userId: string;
  name: string;
  icon: CategoryApi["icon"];
};

export const getCategories = async () => {
  const response = await api.get<CategoryApi[]>("/transactionCategories");

  return response.data;
};

export const getCategoriesServer = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }

  const response = await fetch(`${baseUrl}transactionCategories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories from server.");
  }

  return (await response.json()) as CategoryApi[];
};

export const createCategory = async (payload: CreateCategoryRequest) => {
  const response = await api.post<CategoryApi>("/transactionCategories", payload);

  return response.data;
};
