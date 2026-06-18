"use client";

// React
import type { ComponentProps } from "react";

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
        <div className={className} {...props}>
            <Card className="h-full overflow-hidden p-0">
                <CardContent className="grid h-full p-0 md:grid-cols-2">
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
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
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
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
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
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
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
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