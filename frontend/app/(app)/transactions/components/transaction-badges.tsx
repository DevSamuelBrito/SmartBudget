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

const transactionTypeConfig: Record<
  TransactionType,
  { label: string; className: string }
> = {
  receita: {
    label: "Receita",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  despesa: {
    label: "Despesa",
    className: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  },
  transferencia: {
    label: "Transferência",
    className: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  },
};

const recurrenceConfig: Record<RecurrenceType, { label: string; className: string }> = {
  unica: {
    label: "Única",
    className: "bg-zinc-100 text-zinc-800 hover:bg-zinc-100",
  },
  recorrente: {
    label: "Recorrente",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
};

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  const config = transactionTypeConfig[type];

  return <Badge className={config.className}>{config.label}</Badge>;
}

export function RecurrenceBadge({ recurrence }: RecurrenceBadgeProps) {
  const config = recurrenceConfig[recurrence];

  return <Badge className={config.className}>{config.label}</Badge>;
}
