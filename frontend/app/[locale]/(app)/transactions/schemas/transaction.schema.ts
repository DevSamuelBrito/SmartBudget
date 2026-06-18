import { z } from "zod";

export const transactionFormSchema = z.object({
  amount: z.number().positive("Informe um valor maior que zero."),
  transactionDate: z.string().min(1, "Informe a data da transação."),
  transactionType: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  recurrence: z.union([z.literal(0), z.literal(1)]),
  description: z
    .string()
    .min(1, "Informe uma descrição.")
    .max(255, "A descrição deve ter no máximo 255 caracteres."),
  transactionCategoryId: z.string().nullable(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;