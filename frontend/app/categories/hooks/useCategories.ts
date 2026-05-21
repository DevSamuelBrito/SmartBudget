//react query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// react
import { useState } from "react";

// data
import data from "../data.json";

import type { CategoryApi, CategoryTheme } from "../types";

//services
import {
  createCategory as createCategoryRequest,
  getCategories,
} from "../services/categorias.service";

const MOCK_USER_ID = "1057a770-6f02-47d9-b791-b449d9e95fd3";

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

  const createCategoryMutation = useMutation({
    mutationFn: (payload: { name: string; icon: CategoryApi["icon"] }) =>
      createCategoryRequest({
        userId: MOCK_USER_ID,
        name: payload.name,
        icon: payload.icon,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  function createCategory(payload: CreateCategoryPayload) {
    createCategoryMutation.mutate(payload);
  }
  
  function setSearchValue(value: string) {
    setSearch(value);
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
    isCreatingCategory: createCategoryMutation.isPending,
    updateCategory,
    deleteCategory,
  };
}
