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

export const createCategory = async (payload: CreateCategoryRequest) => {
  const response = await api.post<CategoryApi>("/transactionCategories", payload);

  return response.data;
};
