import { z } from "zod"

export const accountProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z
    .string()
    .trim()
    .email("E-mail inválido."),
})

export type AccountProfileFormValues = z.infer<typeof accountProfileSchema>