import { z } from "zod"

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Senha atual é obrigatória."),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres."),
    confirmNewPassword: z
      .string()
      .min(1, "Confirmação de senha é obrigatória."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "A confirmação deve ser igual à nova senha.",
    path: ["confirmNewPassword"],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>