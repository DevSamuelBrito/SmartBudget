//libs
import { api } from "@/lib/axios";

//types
import type { TransactionApi } from "../types";

export type CreateTransactionRequest = {
  userId: string;
  amount: number;
  transactionDate: string;
  transactionType: TransactionApi["type"];
  recurrence: TransactionApi["recurrence"];
  description: string;
  transactionCategoryId: string | null;
};

export const getTransactionsServer = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }

  const response = await fetch(`${baseUrl}transactions`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions from server.");
  }

  return (await response.json()) as TransactionApi[];
};

export const getTransactions = async () => {
  const response = await api.get<TransactionApi[]>("/transactions");

  return response.data;
};

export const createTransaction = async (payload: CreateTransactionRequest) => {
  const response = await api.post<TransactionApi>("/transactions", payload);

  return response.data;
};

export type UpdateTransactionRequest = CreateTransactionRequest & {
  id: string;
};

export const updateTransaction = async (payload: UpdateTransactionRequest) => {
  const { id, ...body } = payload;
  const response = await api.put<TransactionApi>(`/transactions/${id}`, body);

  return response.data;
};

export const deleteTransaction = async (transactionId: string) => {
  await api.delete(`/transactions/${transactionId}`);
};
