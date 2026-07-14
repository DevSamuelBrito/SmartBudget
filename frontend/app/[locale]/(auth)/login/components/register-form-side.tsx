"use client";

// React
import type { ComponentProps } from "react";

//next
import Image from "next/image";

import Link from "next/link";

// external
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslations } from "next-intl";

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
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

// utils
import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/theme-toggle";

import { LanguageToggle } from "@/components/language-toggle";

// actions
import { registerAction } from "@/app/actions/auth-actions";

// schemas
import {
    registerSchema,
    type RegisterFormValues,
} from "../schemas/register-schema";

type RegisterFormSideProps = {
    onBackToLogin: () => void;
} & ComponentProps<"div">;

export function RegisterFormSide({
    onBackToLogin,
    className,
    ...props
}: RegisterFormSideProps) {
    const t = useTranslations("auth");
    const tVal = useTranslations();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        const result = await registerAction(data);

        if (result.success) {
            toast.success("Conta criada com sucesso. Faça login para continuar.");
            reset();
            onBackToLogin();

            return;
        }

        toast.error(result.error);
    };

    return (
        <div className={cn("h-full", className)} {...props}>
            <Card className="relative h-full overflow-hidden p-0">
                <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-background/80 p-1 shadow-sm backdrop-blur-sm">
                    <ThemeToggle />
                    <LanguageToggle />
                </div>
                <CardContent className="grid h-full p-0 md:grid-cols-2">
                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src="/images/registerImage.jpg"
                            fill
                            alt="Register Image"
                            className="object-cover brightness-[0.8]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute inset-x-6 bottom-6">
                            <Link href="/" className="text-2xl font-bold text-white">
                                SmartBudget
                            </Link>
                            <p className="mt-1 text-sm text-white/90">{t("registerTagline")}</p>
                        </div>
                    </div>
                    <form className="flex flex-col justify-center p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">{t("register")}</h1>
                                <p className="text-balance text-muted-foreground">
                                    {t("register")}
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
                                <Input id="name" type="text" {...register("name")} />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{tVal(errors.name.message as string)}</p>
                                )}
                            </Field>
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
                                <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
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
                                <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{tVal(errors.confirmPassword.message as string)}</p>
                                )}
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? `${t("register")}...` : t("register")}
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                {t("alreadyHaveAccount")} {" "}
                                <button
                                    type="button"
                                    className="bg-transparent p-0 text-sm font-normal text-primary underline-offset-2 hover:underline"
                                    onClick={onBackToLogin}
                                >
                                    {t("login")}
                                </button>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                </CardContent>
            </Card>
        </div>
    );
}