//next
import Link from "next/link"

//icons
import { Home } from "lucide-react"

//components
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
    return (
        <div className="relative flex min-h-[calc(100vh-var(--header-height))] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/40 px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_32%)]" />

            <Card className="relative w-full max-w-xl border-border/70 bg-card/90 shadow-xl backdrop-blur">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/70 text-primary shadow-sm">
                        <span className="text-2xl font-semibold tracking-tight">404</span>
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl sm:text-3xl">Página não encontrada</CardTitle>
                        <CardDescription className="text-base">
                            O endereço que você tentou acessar não existe.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-4 pb-8 text-center">
                    <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                        Você pode voltar para a página inicial para continuar navegando pelo
                        SmartBudget PRO.
                    </p>

                    <Button asChild size="lg" className="w-full max-w-sm shadow-sm shadow-primary/20 sm:w-auto">
                        <Link href="/">
                            <Home className="size-4" />
                            Ir para a página inicial
                        </Link>
                    </Button>

                </CardContent>
            </Card>
        </div>
    )
}