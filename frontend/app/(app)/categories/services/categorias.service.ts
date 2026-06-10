//libs
import { api } from "@/lib/axios";

import { authFetch, getServerUserId } from "@/lib/auth";

import type { CategoryApi } from "../types";

type CreateCategoryRequest = {
  userId: string;
  name: string;
  icon: CategoryApi["icon"];
};

type UpdateCategoryRequest = {
  id: string;
  name: string;
  icon: CategoryApi["icon"];
};

export const getCategories = async () => {
  const response = await api.get<CategoryApi[]>("/transactionCategories");

  return response.data;
};

export const getCategoriesServerCached = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }

  const userId = await getServerUserId();

  const response = await authFetch(`${baseUrl}transactionCategories`, {
    next: { tags: [`categories-${userId}`] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories from server.");
  }

  return (await response.json()) as CategoryApi[];
};

export const createCategory = async (payload: CreateCategoryRequest) => {
  const response = await api.post<CategoryApi>(
    "/transactionCategories",
    payload,
  );

  return response.data;
};

export const updateCategory = async (payload: UpdateCategoryRequest) => {
  const response = await api.put<CategoryApi>(
    "/transactionCategories",
    payload,
  );

  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  await api.delete(`/transactionCategories/${categoryId}`);
};
