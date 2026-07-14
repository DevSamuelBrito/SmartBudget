// React
import { useMemo, useState } from "react";

// react-query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Libs
import { toast } from "sonner";

// Hooks
import { useAuth } from "@/contexts/auth-context";

// APIs / Services
import {
  invalidateBudgetsCache,
  invalidateCategoriesCache,
} from "../actions/categories.actions";

import {
  createBudget as createBudgetRequest,
  getBudgetsByPeriod,
  updateBudget as updateBudgetRequest,
} from "../services/budgets.service";

import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
  getCategories,
  updateCategory as updateCategoryRequest,
} from "../services/categorias.service";

// Types
import type {
  BudgetByPeriodApi,
  CategoryApi,
  CategoryFormValues,
} from "../types";

import type { PagedResult } from "@/types/pagination";

// Constants
import { ICONT_THEME } from "../constants/icons-theme";

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

type AppliedFilters = {
  name: string;
  icon: string;
};

type UseCategoriesProps = {
  initialCategories: PagedResult<CategoryApi>;
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
  const { state } = useAuth();
  const userId = state.user?.userId ?? "";
  const pageSize = 10;

  const iconThemes = ICONT_THEME;

  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const [pendingName, setPendingName] = useState("");
  const [pendingIcon, setPendingIcon] = useState("");

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    name: "",
    icon: "",
  });

  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>({
    month: initialMonth,
    year: initialYear,
  });

  const categoriesQuery = useQuery<PagedResult<CategoryApi>>({
    queryKey: ["categories", userId, { page, pageSize, ...appliedFilters }],
    queryFn: () =>
      getCategories({
        page,
        pageSize,
        name: appliedFilters.name || undefined,
        icon: appliedFilters.icon || undefined,
      }),
    initialData:
      page === 1 && !appliedFilters.name && !appliedFilters.icon
        ? initialCategories
        : undefined,
    staleTime: Infinity,
  });

  const pagedCategories = categoriesQuery.data;
  const categories = pagedCategories?.items ?? [];

  const budgetsQuery = useQuery<BudgetByPeriodApi[]>({
    queryKey: [
      "budgets-by-period",
      userId,
      selectedPeriod.month,
      selectedPeriod.year,
    ],
    queryFn: () =>
      getBudgetsByPeriod({
        month: selectedPeriod.month,
        year: selectedPeriod.year,
      }),
    initialData:
      selectedPeriod.month === initialMonth &&
      selectedPeriod.year === initialYear
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
        userId,
        name: payload.name,
        icon: payload.icon as CategoryApi["icon"],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories", userId] });
      await invalidateCategoriesCache();

      toast.success("Categoria criada com sucesso!");
      onCloseCreate();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategoryRequest(categoryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories", userId] });
      await invalidateCategoriesCache();

      toast.success("Categoria excluida com sucesso!");
      onCloseDelete();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (payload: UpdateCategoryPayload) =>
      updateCategoryRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories", userId] });
      await invalidateCategoriesCache();

      toast.success("Categoria atualizada com sucesso!");
      onCloseEdit();
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
        userId,
        transactionCategoryId: category.id,
        month: selectedPeriod.month,
        year: selectedPeriod.year,
        limitAmount,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "budgets-by-period",
          userId,
          selectedPeriod.month,
          selectedPeriod.year,
        ],
      });
      await invalidateBudgetsCache();

      toast.success("Orçamento salvo com sucesso!");
      onCloseBudget();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleCreateCategory(payload: CategoryFormValues) {
    createCategoryMutation.mutate(payload);
  }

  function handleUpdateCategory(payload: UpdateCategoryPayload) {
    updateCategoryMutation.mutate(payload);
  }

  function handleDeleteCategory(categoryId: string) {
    deleteCategoryMutation.mutate(categoryId);
  }

  function handleUpsertBudget(payload: UpsertBudgetPayload) {
    upsertBudgetMutation.mutate(payload);
  }

  function handleSearch() {
    setAppliedFilters({
      name: pendingName?.trim() ?? "",
      icon: pendingIcon ?? "",
    });
    setPage(1);
  }

  function handleClearFilters() {
    setPendingName("");
    setPendingIcon("");
    setAppliedFilters({ name: "", icon: "" });
    setPage(1);
  }

  return {
    categories,
    page,
    setPage,
    totalPages: pagedCategories?.totalPages ?? 0,
    hasNextPage: pagedCategories?.hasNextPage ?? false,
    hasPreviousPage: pagedCategories?.hasPreviousPage ?? false,
    selectedPeriod,
    setSelectedPeriod,
    budgetMapByCategoryId,

    handleCreateCategory,
    handleUpdateCategory,
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,

    pendingName,
    setPendingName,
    pendingIcon,
    setPendingIcon,
    appliedFilters,
    handleSearch,
    handleClearFilters,

    iconThemes,
    handleDeleteCategory,

    handleUpsertBudget,
    isSavingBudget: upsertBudgetMutation.isPending,
  };
}
