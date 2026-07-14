//libs
import { api } from "@/lib/axios";

import { authFetch, getServerUserId } from "@/lib/auth";

import { getServerApiBaseUrl } from "@/lib/server-api";

import type { PagedResult, PaginationParams } from "@/types/pagination";

//types
import type { FinancialTransactionType, RecurrenceType, TransactionApi } from "../types";

export type TransactionFilters = {
  description?: string;
  categoryId?: string;
  date?: string;
  type?: FinancialTransactionType;
  recurrence?: RecurrenceType;
};

export type CreateTransactionRequest = {
  userId: string;
  amount: number;
  transactionDate: string;
  transactionType: TransactionApi["type"];
  recurrence: TransactionApi["recurrence"];
  description: string;
  transactionCategoryId: string | null;
};

export const getTransactionsServer = async ({
  page = 1,
  pageSize = 10,
}: PaginationParams = {}) => {
  const baseUrl = getServerApiBaseUrl();

  const userId = await getServerUserId();

  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await authFetch(
    `${baseUrl}transactions?${query.toString()}`,
    {
      next: { tags: [`transactions-${userId}`] },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions from server.");
  }

  return (await response.json()) as PagedResult<TransactionApi>;
};

export const getTransactions = async ({
  page = 1,
  pageSize = 10,
  description,
  categoryId,
  date,
  type,
  recurrence,
}: PaginationParams & TransactionFilters = {}) => {
  const response = await api.get<PagedResult<TransactionApi>>("/transactions", {
    params: { page, pageSize, description, categoryId, date, type, recurrence },
  });

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
