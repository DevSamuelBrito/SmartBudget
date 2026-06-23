//types
import type { TransactionApi } from "@/app/[locale]/(app)/transactions/types";

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("pt-BR");

export const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatBoolean = (value: boolean) => (value ? "Sim" : "Não");

export const formatTransactionType = (value: TransactionApi["type"]) => {
  const map: Record<TransactionApi["type"], string> = {
    1: "Receita",
    2: "Despesa",
    3: "Transferência",
  };

  
return map[value];
};

export const formatRecurrence = (value: TransactionApi["recurrence"]) => {
  const map: Record<TransactionApi["recurrence"], string> = {
    0: "Única",
    1: "Recorrente",
  };

  
return map[value];
};
