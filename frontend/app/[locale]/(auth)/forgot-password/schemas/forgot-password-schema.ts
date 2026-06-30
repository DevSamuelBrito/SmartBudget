// zod
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "validation.emailInvalid" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
