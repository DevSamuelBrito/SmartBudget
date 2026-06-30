import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "validation.emailInvalid" }),
  password: z.string().min(6, { message: "validation.passwordMin" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
