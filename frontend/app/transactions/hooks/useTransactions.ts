//react query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// react
import { useState } from "react";

//services
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactions.service";

//types
import type { CategoryApi } from "@/app/categories/types";

import { getCategories } from "@/app/categories/services/categorias.service";

import type { TransactionWithCategory } from "../types";

//schema
import type { TransactionFormValues } from "../schemas/transaction.schema";

//toast
import { toast } from "sonner";

//axios
import type { AxiosError } from "axios";

const MOCK_USER_ID = "1057a770-6f02-47d9-b791-b449d9e95fd3";

type UseTransactionsProps = {
  initialTransactions: TransactionWithCategory[];
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
  const [search, setSearch] = useState("");

  const transactionsQuery = useQuery<TransactionWithCategory[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    initialData: initialTransactions,
    staleTime: Infinity,
  });

  const categoriesQuery = useQuery<CategoryApi[]>({
    queryKey: ["categorias"],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createTransaction({
        userId: MOCK_USER_ID,
        amount: payload.amount,
        transactionDate: payload.transactionDate,
        transactionType: payload.transactionType,
        recurrence: payload.recurrence,
        description: payload.description,
        transactionCategoryId: payload.transactionCategoryId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });

      toast.success("Transação criada com sucesso!");
      onCloseCreate();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data?.error ?? "Erro ao criar transação.";

      toast.error(message);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: (payload: UpdateTransactionPayload) =>
      updateTransaction({
        id: payload.id,
        userId: MOCK_USER_ID,
        amount: payload.amount,
        transactionDate: payload.transactionDate,
        transactionType: payload.transactionType,
        recurrence: payload.recurrence,
        description: payload.description,
        transactionCategoryId: payload.transactionCategoryId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });

      toast.success("Transação atualizada com sucesso!");
      onCloseEdit();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message =
        error.response?.data?.error ?? "Erro ao atualizar transação.";

      toast.error(message);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });

      toast.success("Transação excluída com sucesso!");
      onCloseDelete();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message =
        error.response?.data?.error ?? "Erro ao excluir transação.";

      toast.error(message);
    },
  });

  const categories = categoriesQuery.data ?? [];
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  const normalizedSearch = search.trim().toLowerCase();

  const transactions = (transactionsQuery.data ?? [])
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

