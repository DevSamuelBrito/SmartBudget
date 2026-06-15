"use client"

//react 
import { useEffect, useState } from "react"

//react-hook-form
import { useForm } from "react-hook-form"

//zod
import { zodResolver } from "@hookform/resolvers/zod"

//toast
import { toast } from "sonner"

//components
import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

import {
    accountProfileSchema,
    type AccountProfileFormValues,
} from "@/components/schemas/account-profile.schema"

import {
    changePasswordSchema,
    type ChangePasswordFormValues,
} from "@/components/schemas/change-password.schema"

//context
import { useAuth } from "@/contexts/auth-context"


//hooks
import {
    useChangeUserPassword,
    useUpdateUserProfile,
} from "@/hooks/use-user-account"

type UserAccountDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onProfileUpdated?: (payload: { name: string; email: string }) => void
}

export function UserAccountDialog({
    open,
    onOpenChange,
    onProfileUpdated,
}: UserAccountDialogProps) {
    const { state, dispatch } = useAuth()
    const authUser = state.user

    const [changePasswordSheetOpen, setChangePasswordSheetOpen] = useState(false)

    const profileMutation = useUpdateUserProfile()
    const changePasswordMutation = useChangeUserPassword()

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: {
            errors: profileErrors,
        },
    } = useForm<AccountProfileFormValues>({
        resolver: zodResolver(accountProfileSchema),
        defaultValues: {
            name: authUser?.name ?? "",
            email: authUser?.email ?? "",
        },
    })

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: {
            errors: passwordErrors,
        },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    })

    useEffect(() => {
        if (!open) {
            return
        }

        resetProfile({
            name: authUser?.name ?? "",
            email: authUser?.email ?? "",
        })
    }, [open, authUser?.name, authUser?.email, resetProfile])

    const getErrorMessage = (error: unknown, fallbackMessage: string) => {
        if (error instanceof Error && error.message) {
            return error.message
        }

        return fallbackMessage
    }

    const handleUpdateProfile = async (values: AccountProfileFormValues) => {
        try {
            await profileMutation.mutateAsync(values)

            const userId = authUser?.userId

            if (userId) {
                dispatch({
                    type: "LOGIN",
                    payload: {
                        userId,
                        name: values.name,
                        email: values.email,
                    },
                })
            }

            toast.success("Informações atualizadas com sucesso!")
            onProfileUpdated?.({
                name: values.name,
                email: values.email,
            })
            onOpenChange(false)
        } catch (error) {
            toast.error(getErrorMessage(error, "Não foi possível atualizar as informações."))
        }
    }

    const handleChangePassword = async (values: ChangePasswordFormValues) => {
        try {
            await changePasswordMutation.mutateAsync(values)

            toast.success("Senha alterada com sucesso!")
            resetPassword()
            setChangePasswordSheetOpen(false)
        } catch (error) {
            toast.error(getErrorMessage(error, "Não foi possível alterar a senha."))
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Minha Conta</DialogTitle>
                        <DialogDescription>
                            Atualize seus dados pessoais e gerencie a segurança da conta.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <section className="space-y-4 rounded-lg border p-4">
                            <div className="space-y-1">
                                <h3 className="font-medium">Informações pessoais</h3>
                                <p className="text-sm text-muted-foreground">
                                    Edite seu nome e e-mail.
                                </p>
                            </div>

                            <form id="account-profile-form" className="space-y-3" onSubmit={handleSubmitProfile(handleUpdateProfile)}>
                                <div className="space-y-2">
                                    <Label htmlFor="account-name">Nome</Label>
                                    <Input
                                        id="account-name"
                                        placeholder="Seu nome"
                                        {...registerProfile("name")}
                                        disabled={profileMutation.isPending}
                                    />
                                    {profileErrors.name && (
                                        <p className="text-sm text-destructive">{profileErrors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="account-email">E-mail</Label>
                                    <Input
                                        id="account-email"
                                        type="email"
                                        placeholder="voce@email.com"
                                        {...registerProfile("email")}
                                        disabled={profileMutation.isPending}
                                    />
                                    {profileErrors.email && (
                                        <p className="text-sm text-destructive">{profileErrors.email.message}</p>
                                    )}
                                </div>
                            </form>
                        </section>

                        <section className="space-y-3 rounded-lg border p-4">
                            <div className="space-y-1">
                                <h3 className="font-medium">Segurança</h3>
                                <p className="text-sm text-muted-foreground">
                                    Altere sua senha de acesso.
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onOpenChange(false)
                                    setChangePasswordSheetOpen(true)
                                }}
                            >
                                Alterar Senha
                            </Button>
                        </section>
                    </div>

                    <DialogFooter>
                        <Button
                            form="account-profile-form"
                            type="submit"
                            disabled={profileMutation.isPending}
                        >
                            {profileMutation.isPending ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet
                open={changePasswordSheetOpen}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        resetPassword()
                    }

                    setChangePasswordSheetOpen(nextOpen)
                }}
            >
                <SheetContent side="right" className="sm:max-w-md" closeButtonDisabled={changePasswordMutation.isPending}>
                    <SheetHeader>
                        <SheetTitle>Alterar Senha</SheetTitle>
                        <SheetDescription>
                            Informe sua senha atual e defina uma nova senha.
                        </SheetDescription>
                    </SheetHeader>

                    <form id="change-password-form" className="space-y-4 px-4" onSubmit={handleSubmitPassword(handleChangePassword)}>
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Senha atual</Label>
                            <Input
                                id="current-password"
                                type="password"
                                {...registerPassword("currentPassword")}
                                disabled={changePasswordMutation.isPending}
                            />
                            {passwordErrors.currentPassword && (
                                <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nova senha</Label>
                            <Input
                                id="new-password"
                                type="password"
                                {...registerPassword("newPassword")}
                                disabled={changePasswordMutation.isPending}
                            />
                            {passwordErrors.newPassword && (
                                <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-new-password">Confirmar nova senha</Label>
                            <Input
                                id="confirm-new-password"
                                type="password"
                                {...registerPassword("confirmNewPassword")}
                                disabled={changePasswordMutation.isPending}
                            />
                            {passwordErrors.confirmNewPassword && (
                                <p className="text-sm text-destructive">{passwordErrors.confirmNewPassword.message}</p>
                            )}
                        </div>
                    </form>

                    <SheetFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                resetPassword()
                                setChangePasswordSheetOpen(false)
                            }}
                            disabled={changePasswordMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            form="change-password-form"
                            type="submit"
                            disabled={changePasswordMutation.isPending}
                        >
                            {changePasswordMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}