//libs
import { api } from "@/lib/axios";

import { authFetch, getServerUserId } from "@/lib/auth";

import { getServerApiBaseUrl } from "@/lib/server-api";

//types
import type { PagedResult, PaginationParams } from "@/types/pagination";

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

export const getCategories = async ({
  page = 1,
  pageSize = 10,
}: PaginationParams = {}) => {
  const response = await api.get<PagedResult<CategoryApi>>(
    "/transactionCategories",
    {
      params: { page, pageSize },
    },
  );

  return response.data;
};

export const getCategoriesServer = async ({
  page = 1,
  pageSize = 10,
}: PaginationParams = {}) => {
  const baseUrl = getServerApiBaseUrl();

  const userId = await getServerUserId();

  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await authFetch(
    `${baseUrl}transactionCategories?${query.toString()}`,
    {
      next: { tags: [`categories-${userId}`] },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories from server.");
  }

  return (await response.json()) as PagedResult<CategoryApi>;
};

export const getCategoriesServerCached = async ({
  page = 1,
  pageSize = 10,
}: PaginationParams = {}) => {
  return getCategoriesServer({ page, pageSize });
};

export const getCategoryOptions = async () => {
  const pagedCategories = await getCategories({ page: 1, pageSize: 100 });

  return pagedCategories.items;
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
