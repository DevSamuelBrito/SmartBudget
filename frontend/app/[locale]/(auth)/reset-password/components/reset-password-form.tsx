"use client";

// react
import { useEffect, useState } from "react";

// next
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// next-intl
import { useTranslations } from "next-intl";

// react-hook-form / zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// sonner
import { toast } from "sonner";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// actions
import { resetPasswordAction } from "@/app/actions/auth-actions";

// schemas
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password-schema";

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPasswordPage");
  const tVal = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [hasTokenError, setHasTokenError] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {

    if (!token) return;

    const result = await resetPasswordAction({
      token,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });

    if (!result.success) {
      setHasTokenError(true);

      return;
    }

    toast.success(t("successToast"));
    router.push("/login");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-6 md:p-8">
            {hasTokenError ? (
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">{t("title")}</h1>
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {t("invalidToken")}
                  </p>
                </div>
                <Field>
                  <Button asChild>
                    <Link href="/forgot-password">{t("requestNewLink")}</Link>
                  </Button>
                </Field>
              </FieldGroup>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <div className="relative flex w-full items-center justify-center">

                    <h1 className="text-center text-2xl font-bold">
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
                    <FieldLabel htmlFor="newPassword">
                      {t("newPasswordLabel")}
                    </FieldLabel>
                    <Input
                      id="newPassword"
                      type="password"
                      {...register("newPassword")}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {tVal(errors.newPassword.message as string)}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmNewPassword">
                      {t("confirmPasswordLabel")}
                    </FieldLabel>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      {...register("confirmNewPassword")}
                    />
                    {errors.confirmNewPassword && (
                      <p className="text-sm text-destructive">
                        {tVal(errors.confirmNewPassword.message as string)}
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
