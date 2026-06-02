// react
import { useMemo, useState } from "react";

//axios
import type { AxiosError } from "axios";

//toast
import { toast } from "sonner";

//react query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// icons
import { ICONT_THEME } from "../constants/icons-theme";

import type {
  BudgetByPeriodApi,
  CategoryApi,
  CategoryFormValues,
} from "../types";

//services
import {
  getCategories,
  createCategory as createCategoryRequest,
  updateCategory as updateCategoryRequest,
  deleteCategory as deleteCategoryRequest,
} from "../services/categorias.service";
import {
  createBudget as createBudgetRequest,
  getBudgetsByPeriod,
  updateBudget as updateBudgetRequest,
} from "../services/budgets.service";

import {
  invalidateBudgetsCache,
  invalidateCategoriesCache,
} from "../actions/categories.actions";

const MOCK_USER_ID = "1057a770-6f02-47d9-b791-b449d9e95fd3";

type UpdateCategoryPayload = {
  id: string;
  name: string;
  icon: CategoryApi["icon"];
};

type BudgetPeriod = {
  month: number;
  year: number;
};

type UpsertBudgetPayload = {
  category: CategoryApi;
  limitAmount: number;
};

type UseCategoriesProps = {
  initialCategories: CategoryApi[];
  initialBudgets: BudgetByPeriodApi[];
  initialMonth: number;
  initialYear: number;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onCloseBudget: () => void;
};

export function useCategories({
  initialCategories,
  initialBudgets,
  initialMonth,
  initialYear,
  onCloseCreate,
  onCloseEdit,
  onCloseDelete,
  onCloseBudget,
}: UseCategoriesProps) {
  const iconThemes = ICONT_THEME;

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>({
    month: initialMonth,
    year: initialYear,
  });

  const categoriasQuery = useQuery<CategoryApi[]>({
    queryKey: ["categorias"],
    queryFn: getCategories,
    initialData: initialCategories,
    staleTime: Infinity,
  });

  const categories = categoriasQuery.data ?? [];

  const budgetsQuery = useQuery<BudgetByPeriodApi[]>({
    queryKey: ["budgets-by-period", selectedPeriod.month, selectedPeriod.year],
    queryFn: () =>
      getBudgetsByPeriod({
        month: selectedPeriod.month,
        year: selectedPeriod.year,
      }),
    initialData:
      selectedPeriod.month === initialMonth && selectedPeriod.year === initialYear
        ? initialBudgets
        : undefined,
  });

  const budgetMapByCategoryId = useMemo(() => {
    const map = new Map<string, BudgetByPeriodApi>();

    for (const budget of budgetsQuery.data ?? []) {
      map.set(budget.transactionCategoryId, budget);
    }

    return map;
  }, [budgetsQuery.data]);

  const createCategoryMutation = useMutation({
    mutationFn: (payload: CategoryFormValues) =>
      createCategoryRequest({
        userId: MOCK_USER_ID,
        name: payload.name,
        icon: payload.icon as CategoryApi["icon"],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      await invalidateCategoriesCache();

      toast.success("Categoria criada com sucesso!");
      onCloseCreate();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data?.error ?? "Erro ao criar categoria.";

      toast.error(message);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategoryRequest(categoryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      await invalidateCategoriesCache();

      toast.success("Categoria excluida com sucesso!");
      onCloseDelete();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data?.error ?? "Erro ao excluir categoria.";

      toast.error(message);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (payload: UpdateCategoryPayload) => updateCategoryRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      await invalidateCategoriesCache();

      toast.success("Categoria atualizada com sucesso!");
      onCloseEdit();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data?.error ?? "Erro ao atualizar categoria.";

      toast.error(message);
    },
  });

  const upsertBudgetMutation = useMutation({
    mutationFn: async ({ category, limitAmount }: UpsertBudgetPayload) => {
      const existingBudget = budgetMapByCategoryId.get(category.id);

      if (existingBudget) {
        await updateBudgetRequest({
          id: existingBudget.id,
          limitAmount,
        });

        return;
      }

      await createBudgetRequest({
        userId: MOCK_USER_ID,
        transactionCategoryId: category.id,
        month: selectedPeriod.month,
        year: selectedPeriod.year,
        limitAmount,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["budgets-by-period", selectedPeriod.month, selectedPeriod.year],
      });
      await invalidateBudgetsCache({
        month: selectedPeriod.month,
        year: selectedPeriod.year,
      });

      toast.success("Orcamento salvo com sucesso!");
      onCloseBudget();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data?.error ?? "Erro ao salvar orcamento.";

      toast.error(message);
    },
  });

  function createCategory(payload: CategoryFormValues) {
    createCategoryMutation.mutate(payload);
  }

  function handleCreateCategory(payload: CategoryFormValues) {
    createCategory(payload);
  }

  function handleUpdateCategory(payload: UpdateCategoryPayload) {
    updateCategoryMutation.mutate(payload);
  }

  function setSearchValue(value: string) {
    setSearch(value);
  }

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCategories = categories.filter((category) => {
    if (!normalizedSearch) {
      return true;
    }

    return category.name.toLowerCase().includes(normalizedSearch);
  });

  function handleDeleteCategory(categoryId: string) {
    deleteCategoryMutation.mutate(categoryId);
  }

  function handleUpsertBudget(payload: UpsertBudgetPayload) {
    upsertBudgetMutation.mutate(payload);
  }

  return {
    categories: filteredCategories,
    selectedPeriod,
    setSelectedPeriod,
    budgetMapByCategoryId,

    handleCreateCategory,
    handleUpdateCategory,
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,

    search,
    setSearch: setSearchValue,
    iconThemes,
    handleDeleteCategory,

    handleUpsertBudget,
    isSavingBudget: upsertBudgetMutation.isPending,
  };
}
