"use client";

// i18n
import { useTranslations } from "next-intl";

//components
import { Badge } from "@/components/ui/badge";

type TransactionType = "receita" | "despesa" | "transferencia";

type RecurrenceType = "unica" | "recorrente";

type TransactionTypeBadgeProps = {
  type: TransactionType;
};

type RecurrenceBadgeProps = {
  recurrence: RecurrenceType;
};

const transactionTypeClassName: Record<TransactionType, string> = {
  receita: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  despesa: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  transferencia: "bg-sky-100 text-sky-800 hover:bg-sky-100",
};

const recurrenceClassName: Record<RecurrenceType, string> = {
  unica: "bg-zinc-100 text-zinc-800 hover:bg-zinc-100",
  recorrente: "bg-amber-100 text-amber-800 hover:bg-amber-100",
};

export function TransactionTypeBadge({ type }: Readonly<TransactionTypeBadgeProps>) {
  const t = useTranslations("transactions.types");

  return (
    <Badge className={transactionTypeClassName[type]}>
      {t(type)}
    </Badge>
  );
}

export function RecurrenceBadge({ recurrence }: Readonly<RecurrenceBadgeProps>) {
  const t = useTranslations("transactions.recurrence");

  return (
    <Badge className={recurrenceClassName[recurrence]}>
      {t(recurrence)}
    </Badge>
  );
}
