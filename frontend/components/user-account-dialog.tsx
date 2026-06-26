"use client"

//react
import { useEffect, useState } from "react"

// i18n
import { useTranslations } from "next-intl"

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

//libs
import { setClientUserDataCookie } from "@/lib/client-auth"


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
    const t = useTranslations("account")

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
                const nextProfile = {
                    userId,
                    name: values.name,
                    email: values.email,
                    isPremium: authUser?.isPremium ?? false,
                }

                dispatch({
                    type: "LOGIN",
                    payload: nextProfile,
                })

                setClientUserDataCookie(nextProfile)
            }

            toast.success(t("updateSuccess"))
            onProfileUpdated?.({
                name: values.name,
                email: values.email,
            })
            onOpenChange(false)
        } catch (error) {
            toast.error(getErrorMessage(error, t("updateError")))
        }
    }

    const handleChangePassword = async (values: ChangePasswordFormValues) => {
        try {
            await changePasswordMutation.mutateAsync(values)

            toast.success(t("passwordSuccess"))
            resetPassword()
            setChangePasswordSheetOpen(false)
        } catch (error) {
            toast.error(getErrorMessage(error, t("passwordError")))
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t("title")}</DialogTitle>
                        <DialogDescription>
                            {t("description")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <section className="space-y-4 rounded-lg border p-4">
                            <div className="space-y-1">
                                <h3 className="font-medium">{t("personalInfo.title")}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t("personalInfo.description")}
                                </p>
                            </div>

                            <form id="account-profile-form" className="space-y-3" onSubmit={handleSubmitProfile(handleUpdateProfile)}>
                                <div className="space-y-2">
                                    <Label htmlFor="account-name">{t("personalInfo.nameLabel")}</Label>
                                    <Input
                                        id="account-name"
                                        placeholder={t("personalInfo.namePlaceholder")}
                                        {...registerProfile("name")}
                                        disabled={profileMutation.isPending}
                                    />
                                    {profileErrors.name && (
                                        <p className="text-sm text-destructive">{profileErrors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="account-email">{t("personalInfo.emailLabel")}</Label>
                                    <Input
                                        id="account-email"
                                        type="email"
                                        placeholder={t("personalInfo.emailPlaceholder")}
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
                                <h3 className="font-medium">{t("subscription.title")}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t("subscription.description")}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${authUser?.isPremium ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>
                                    {authUser?.isPremium ? t("subscription.premium") : t("subscription.free")}
                                </span>
                            </div>
                        </section>

                        <section className="space-y-3 rounded-lg border p-4">
                            <div className="space-y-1">
                                <h3 className="font-medium">{t("security.title")}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t("security.description")}
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
                                {t("security.changePasswordButton")}
                            </Button>
                        </section>
                    </div>

                    <DialogFooter>
                        <Button
                            form="account-profile-form"
                            type="submit"
                            disabled={profileMutation.isPending}
                        >
                            {profileMutation.isPending ? t("saving") : t("saveChanges")}
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
                        <SheetTitle>{t("changePassword.title")}</SheetTitle>
                        <SheetDescription>
                            {t("changePassword.description")}
                        </SheetDescription>
                    </SheetHeader>

                    <form id="change-password-form" className="space-y-4 px-4" onSubmit={handleSubmitPassword(handleChangePassword)}>
                        <div className="space-y-2">
                            <Label htmlFor="current-password">{t("changePassword.currentPasswordLabel")}</Label>
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
                            <Label htmlFor="new-password">{t("changePassword.newPasswordLabel")}</Label>
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
                            <Label htmlFor="confirm-new-password">{t("changePassword.confirmPasswordLabel")}</Label>
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
                            {t("changePassword.cancel")}
                        </Button>
                        <Button
                            form="change-password-form"
                            type="submit"
                            disabled={changePasswordMutation.isPending}
                        >
                            {changePasswordMutation.isPending ? t("changePassword.saving") : t("changePassword.save")}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}