"use client";

// React
import type { ComponentProps } from "react";

// Next
import Link from "next/dist/client/link";

import { useRouter } from "next/navigation";

// next-intl
import { useTranslations } from "next-intl";

// external
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";


import { toast } from "sonner";

// components
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

// contexts
import { useAuth } from "@/contexts/auth-context";

// actions
import { loginAction } from "@/app/actions/auth-actions";

// schemas
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";

type LoginFormSideProps = {
  onSignUpClick: () => void;
} & ComponentProps<"div">;

export function LoginFormSide({ onSignUpClick, className, ...props }: LoginFormSideProps) {
  const router = useRouter();
  const t = useTranslations("auth");
  const tVal = useTranslations();

  const { dispatch } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await loginAction(data);

    if (result.success) {
      dispatch({ type: "LOGIN", payload: result.user });
      router.push("/dashboard");

      return;
    }

    toast.error(result.error);
  };

  return (
    <div className={className} {...props}>
      <Card className="h-full overflow-hidden p-0">
        <CardContent className="grid h-full p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t("login")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("login")}
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{tVal(errors.email.message as string)}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                  <Link href="/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline">
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{tVal(errors.password.message as string)}</p>
                )}
              </Field>
              <Field>
                <Button data-testid="login-submit-button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? `${t("login")}...` : t("login")}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                {t("noAccount")} {" "}
                <button
                  type="button"
                  className="bg-transparent p-0 text-sm font-normal text-primary underline-offset-2 hover:underline"
                  onClick={onSignUpClick}
                >
                  {t("register")}
                </button>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}