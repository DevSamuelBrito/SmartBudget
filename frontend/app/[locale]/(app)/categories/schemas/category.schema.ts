import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Informe um nome.").max(100, "O nome deve ter no máximo 100 caracteres."),
  icon: z.string().min(1, "Selecione um ícone.").max(200, "O ícone deve ter no máximo 200 caracteres."),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;