//libs
import { api } from "@/lib/axios";

//types
import type { TransactionApi } from "../types";

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
