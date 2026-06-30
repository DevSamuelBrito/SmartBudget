// zod
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: "validation.passwordMin" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "validation.passwordsDoNotMatch",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
