//react query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// react
import { useState } from "react";

//services
import {
  getTransactions,
  createTransaction,
} from "../services/transactions.service";

//types
import type { CategoryApi } from "@/app/categories/types";

import { getCategories } from "@/app/categories/services/categorias.service";

import type { TransactionApi } from "../types";

//schema
import type { TransactionFormValues } from "../schemas/transaction.schema";

//toast
import { toast } from "sonner";

//axios
import type { AxiosError } from "axios";

const MOCK_USER_ID = "1057a770-6f02-47d9-b791-b449d9e95fd3";

type UseTransactionsProps = {
  initialTransactions: TransactionApi[];
  onCloseCreate: () => void;
};

type CreateTransactionPayload = TransactionFormValues;

export function useTransactions({
  initialTransactions,
  onCloseCreate,
}: UseTransactionsProps) {
  const [search, setSearch] = useState("");

  const transactionsQuery = useQuery({
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

  const categories = categoriesQuery.data ?? [];

  const normalizedSearch = search.trim().toLowerCase();

  const transactions = (transactionsQuery.data ?? []).filter((transaction) => {
    if (!normalizedSearch) {
      return true;
    }

    const categoryName =
      categories.find(
        (category) => category.id === transaction.transactionCategoryId,
      )?.name ?? "";

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

  return {
    transactions,
    categories,
    search,
    setSearch,
    handleCreateTransaction,
    isCreatingTransaction: createTransactionMutation.isPending,
  };
}

