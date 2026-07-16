// React
import { useMemo, useState } from "react";

// react-query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Libs
import { toast } from "sonner";

// Hooks
import { useAuth } from "@/contexts/auth-context";


// APIs / Services
import { getCategoryOptions } from "@/app/[locale]/(app)/categories/services/categorias.service";

import { invalidateTransactionsCache } from "../actions/transactions.actions";

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../services/transactions.service";

// Types
import type { CategoryApi } from "@/app/[locale]/(app)/categories/types";

import type { TransactionFormValues } from "../schemas/transaction.schema";

import type { PagedResult } from "@/types/pagination";

import type { FinancialTransactionType, RecurrenceType, TransactionApi } from "../types";

type UseTransactionsProps = {
  initialTransactions: PagedResult<TransactionApi>;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
};

type UpdateTransactionPayload = TransactionFormValues & { id: string };

type CreateTransactionPayload = TransactionFormValues;

type AppliedFilters = {
  description: string;
  categoryId: string;
  date: string;
  type: FinancialTransactionType | "";
  recurrence: RecurrenceType | "";
};

const emptyFilters: AppliedFilters = {
  description: "",
  categoryId: "",
  date: "",
  type: "",
  recurrence: "",
};

export function useTransactions({
  initialTransactions,
  onCloseCreate,
  onCloseEdit,
  onCloseDelete,
}: UseTransactionsProps) {
  const { state } = useAuth();
  const userId = state.user?.userId ?? "";
  const pageSize = 10;

  const [page, setPage] = useState(1);

  const [pendingFilters, setPendingFilters] = useState<AppliedFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(emptyFilters);

  const transactionsQuery = useQuery<PagedResult<TransactionApi>>({
    queryKey: ["transactions", userId, { page, pageSize, ...appliedFilters }],
    queryFn: () =>
      getTransactions({
        page,
        pageSize,
        description: appliedFilters.description || undefined,
        categoryId: appliedFilters.categoryId || undefined,
        date: appliedFilters.date || undefined,
        type: appliedFilters.type !== "" ? appliedFilters.type : undefined,
        recurrence: appliedFilters.recurrence !== "" ? appliedFilters.recurrence : undefined,
      }),
    initialData:
      page === 1 &&
      !appliedFilters.description &&
      !appliedFilters.categoryId &&
      !appliedFilters.date &&
      appliedFilters.type === "" &&
      appliedFilters.recurrence === ""
        ? initialTransactions
        : undefined,
    staleTime: Infinity,
  });

  const categoriesQuery = useQuery<CategoryApi[]>({
    queryKey: ["categories", userId, "options"],
    queryFn: getCategoryOptions,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createTransaction({
        userId,
        amount: payload.amount,
        transactionDate: payload.transactionDate,
        transactionType: payload.transactionType,
        recurrence: payload.recurrence,
        description: payload.description,
        transactionCategoryId: payload.transactionCategoryId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["transactions", userId],
      });
      await invalidateTransactionsCache();

      toast.success("Transação criada com sucesso!");
      onCloseCreate();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: (payload: UpdateTransactionPayload) =>
      updateTransaction({
        id: payload.id,
        userId,
        amount: payload.amount,
        transactionDate: payload.transactionDate,
        transactionType: payload.transactionType,
        recurrence: payload.recurrence,
        description: payload.description,
        transactionCategoryId: payload.transactionCategoryId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["transactions", userId],
      });
      await invalidateTransactionsCache();

      toast.success("Transação atualizada com sucesso!");
      onCloseEdit();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["transactions", userId],
      });
      await invalidateTransactionsCache();

      toast.success("Transação excluída com sucesso!");
      onCloseDelete();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const transactions = (transactionsQuery.data?.items ?? []).map((transaction) => ({
    ...transaction,
    category: transaction.transactionCategoryId
      ? categoryMap.get(transaction.transactionCategoryId)
      : undefined,
  }));

  function handleCreateTransaction(payload: CreateTransactionPayload) {
    createTransactionMutation.mutate(payload);
  }

  function handleUpdateTransaction(payload: UpdateTransactionPayload) {
    updateTransactionMutation.mutate(payload);
  }

  function handleDeleteTransaction(transactionId: string) {
    deleteTransactionMutation.mutate(transactionId);
  }

  function handleSearch() {
    setAppliedFilters({ ...pendingFilters });
    setPage(1);
  }

  function handleClearFilters() {
    setPendingFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  }

  const hasActiveFilters =
    Boolean(appliedFilters.description) ||
    Boolean(appliedFilters.categoryId) ||
    Boolean(appliedFilters.date) ||
    appliedFilters.type !== "" ||
    appliedFilters.recurrence !== "";

  return {
    transactions,
    page,
    setPage,
    totalPages: transactionsQuery.data?.totalPages ?? 0,
    hasNextPage: transactionsQuery.data?.hasNextPage ?? false,
    hasPreviousPage: transactionsQuery.data?.hasPreviousPage ?? false,
    categories,
    handleCreateTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    isCreatingTransaction: createTransactionMutation.isPending,
    isUpdatingTransaction: updateTransactionMutation.isPending,
    isDeletingTransaction: deleteTransactionMutation.isPending,
    pendingFilters,
    setPendingFilters,
    appliedFilters,
    hasActiveFilters,
    handleSearch,
    handleClearFilters,
  };
}
