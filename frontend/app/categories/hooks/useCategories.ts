//react query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// react
import { useState } from "react";

// data
import data from "../data.json";

import type { CategoryApi, CategoryFormValues, CategoryTheme } from "../types";

//services
import {
  createCategory as createCategoryRequest,
  getCategories,
} from "../services/categorias.service";

//toast
import { toast } from "sonner";

//axios
import type { AxiosError } from "axios";

const MOCK_USER_ID = "1057a770-6f02-47d9-b791-b449d9e95fd3";

type UpdateCategoryPayload = {
  name: string;
  icon: CategoryApi["icon"];
};


type UseCategoriesProps = {
  onCloseCreate: () => void;
  onCloseEdit: () => void;
};

export function useCategories({
  onCloseCreate,
  onCloseEdit,
}: UseCategoriesProps) {
  const iconThemes = (data.themes as CategoryTheme[]) ?? [];

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const categoriasQuery = useQuery<CategoryApi[]>({
    queryKey: ["categorias"],
    queryFn: getCategories,
  });

  const categories = categoriasQuery.data ?? [];

  const createCategoryMutation = useMutation({
    mutationFn: (payload: CategoryFormValues) =>
      createCategoryRequest({
        userId: MOCK_USER_ID,
        name: payload.name,
        icon: payload.icon,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });

      toast.success("Categoria criada com sucesso!");
      onCloseCreate();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data?.error ?? "Erro ao criar categoria.";
      
      toast.error(message);
    },
  });

  function createCategory(payload: CategoryFormValues) {
    createCategoryMutation.mutate(payload);
  }

  function handleCreateCategory(payload: CategoryFormValues) {
    createCategory(payload);
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
    handleCreateCategory,
    isCreatingCategory: createCategoryMutation.isPending,

    search,
    setSearch: setSearchValue,
    iconThemes,
    updateCategory,
    deleteCategory,
  };
}
