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

import type { TransactionApi } from "../types";

type UseTransactionsProps = {
  initialTransactions: PagedResult<TransactionApi>;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
};

type UpdateTransactionPayload = TransactionFormValues & { id: string };

type CreateTransactionPayload = TransactionFormValues;

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

  const [search, setSearch] = useState("");

  const transactionsQuery = useQuery<PagedResult<TransactionApi>>({
    queryKey: ["transactions", userId, { page, pageSize }],
    queryFn: () => getTransactions({ page, pageSize }),
    initialData: page === 1 ? initialTransactions : undefined,
    staleTime: Infinity,
  });

  const categoriesQuery = useQuery<CategoryApi[]>({
    queryKey: ["categories-options", userId],
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

  const normalizedSearch = search.trim().toLowerCase();

  const transactions = (transactionsQuery.data?.items ?? [])
    .map((transaction) => ({
      ...transaction,
      category: transaction.transactionCategoryId
        ? categoryMap.get(transaction.transactionCategoryId)
        : undefined,
    }))
    .filter((transaction) => {
      if (!normalizedSearch) {
        return true;
      }

      const categoryName = transaction.category?.name ?? "";

      const searchableValues = [
        transaction.description,
        transaction.transactionDate,
        transaction.amount.toString(),
        categoryName,
      ]
        .join(" ")
        .toLowerCase();

      return searchableValues.includes(normalizedSearch);
    });

  function handleCreateTransaction(payload: CreateTransactionPayload) {
    createTransactionMutation.mutate(payload);
  }

  function handleUpdateTransaction(payload: UpdateTransactionPayload) {
    updateTransactionMutation.mutate(payload);
  }

  function handleDeleteTransaction(transactionId: string) {
    deleteTransactionMutation.mutate(transactionId);
  }

  return {
    transactions,
    page,
    setPage,
    totalPages: transactionsQuery.data?.totalPages ?? 0,
    hasNextPage: transactionsQuery.data?.hasNextPage ?? false,
    hasPreviousPage: transactionsQuery.data?.hasPreviousPage ?? false,
    categories,
    search,
    setSearch,
    handleCreateTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    isCreatingTransaction: createTransactionMutation.isPending,
    isUpdatingTransaction: updateTransactionMutation.isPending,
    isDeletingTransaction: deleteTransactionMutation.isPending,
  };
}
