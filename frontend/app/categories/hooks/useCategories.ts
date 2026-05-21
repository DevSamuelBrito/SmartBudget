//react query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// react
import { useMemo, useState } from "react";

// data
import data from "../data.json";

import type { CategoryApi, CategoryTheme } from "../types";

//services
import { getCategories } from "../services/categorias.service";

type CreateCategoryPayload = {
  name: string;
  icon: CategoryApi["icon"];
};

type UpdateCategoryPayload = {
  name: string;
  icon: CategoryApi["icon"];
};

export function useCategories() {
  const iconThemes = (data.themes as CategoryTheme[]) ?? [];

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const categoriasQuery = useQuery<CategoryApi[]>({
    queryKey: ["categorias"],
    queryFn: getCategories,
  });

  const categories = categoriasQuery.data ?? [];

  function setSearchValue(value: string) {
    setSearch(value);
  }

  function createCategory(payload: CreateCategoryPayload) {
    const nextCategory: CategoryApi = {
      id: crypto.randomUUID(),
      userId: "",
      name: payload.name,
      icon: payload.icon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queryClient.setQueryData<CategoryApi[]>(["categorias"], (current) => [
      nextCategory,
      ...(current ?? []),
    ]);
  }

  function updateCategory(categoryId: string, payload: UpdateCategoryPayload) {
    queryClient.setQueryData<CategoryApi[]>(["categorias"], (current) =>
      (current ?? []).map((category) =>
        category.id === categoryId
          ? {
              ...category,
              ...payload,
              updatedAt: new Date().toISOString(),
            }
          : category,
      ),
    );
  }

  function deleteCategory(categoryId: string) {
    queryClient.setQueryData<CategoryApi[]>(["categorias"], (current) =>
      (current ?? []).filter((category) => category.id !== categoryId),
    );
  }

  return {
    categories,

    search,
    setSearch: setSearchValue,
    iconThemes,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
