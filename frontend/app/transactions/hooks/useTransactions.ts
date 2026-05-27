//react query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// react
import { useState } from "react";

//services
import { getTransactions } from "../services/transactions.service";

//types
import type { TransactionApi } from "../types";

type UseTransactionsProps = {
  initialTransactions: TransactionApi[];
};

export function useTransitions({ initialTransactions }: UseTransactionsProps) {
  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    initialData: initialTransactions,
    staleTime: Infinity,
  });

  const transactions = transactionsQuery.data ?? [];

  return {
    transactions,
  };
}
