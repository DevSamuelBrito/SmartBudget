"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { ArrowLeft } from "lucide-react";

// react-hook-form / zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// actions
import { forgotPasswordAction } from "@/app/actions/auth-actions";

// schemas
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgot-password-schema";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPasswordPage");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await forgotPasswordAction(data);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-6 md:p-8">
            {submitted ? (
              <div className="flex flex-col gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex w-full items-center justify-center">

                    <h1 className="text-center text-2xl font-bold">
                      SmartBudget PRO
                    </h1>
                  </div>
                  <div className="mb-2 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
                  <p className="text-balance text-muted-foreground my-4">
                    {t("successMessage")}
                  </p>

                  <Button asChild>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2"
                      aria-label={t("backToLogin")}
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      {t("backToLogin")}
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <div className="relative flex w-full items-center justify-center">
                    <Link
                      href="/login"
                      className="absolute left-0 inline-flex items-center text-muted-foreground underline-offset-2 hover:underline"
                      aria-label={t("backToLogin")}
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <h1 className="text-center text-xl font-bold">
                      SmartBudget PRO
                    </h1>
                  </div>

                  <div className="mb-2 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">{t("title")}</h1>
                    <p className="text-balance text-muted-foreground">
                      {t("description")}
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? t("submitting") : t("submitButton")}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
