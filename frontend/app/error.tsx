"use client"

// react
import { useEffect } from "react"

//next
import Link from "next/link"

// next-intl
import { useTranslations } from "next-intl"

//icons
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

//components
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorPageProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
    const t = useTranslations("error")

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-muted/40 px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_32%)]" />

            <Card className="relative w-full max-w-xl border-border/70 bg-card/90 shadow-xl backdrop-blur">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/70 text-primary shadow-sm">
                        <AlertTriangle className="size-8" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl sm:text-3xl">{t("title")}</CardTitle>
                        <CardDescription className="text-base">
                            {t("description")}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-4 pb-8 text-center">
                    <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                        {t("body")}
                    </p>

                    {process.env.NODE_ENV === "development" && (
                        <div className="w-full max-w-md rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-left">
                            <p className="break-words font-mono text-xs text-destructive">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="mt-1 break-words font-mono text-xs text-muted-foreground">
                                    digest: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:flex-row">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={() => reset()}
                        >
                            <RefreshCw className="size-4" />
                            {t("retryButton")}
                        </Button>

                        <Button asChild size="lg" className="w-full shadow-sm shadow-primary/20 sm:w-auto">
                            <Link href="/dashboard">
                                <Home className="size-4" />
                                {t("homeButton")}
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
