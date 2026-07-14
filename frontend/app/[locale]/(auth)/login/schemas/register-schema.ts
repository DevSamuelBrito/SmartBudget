import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "validation.nameMin" }),
    email: z.email({ message: "validation.emailInvalid" }),
    password: z.string().min(6, { message: "validation.passwordMin" }),
    confirmPassword: z.string().min(6, { message: "validation.passwordMin" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
