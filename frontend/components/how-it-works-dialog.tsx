"use client"

// react
import * as React from "react"

// next
import Link from "next/link"

// i18n
import { useTranslations } from "next-intl"

// icons
import {
  Rocket,
  Wallet,
  FileBarChart2,
  Crown,
  FolderPlus,
  PiggyBank,
  Receipt,
  LayoutDashboard,
  Move,
  Gauge,
  BarChart3,
  BellRing,
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  FileSpreadsheet,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

// components
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// utils
import { cn } from "@/lib/utils"

type HowItWorksDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type InfoItemProps = React.ComponentProps<"div"> & {
  icon: LucideIcon
  title: string
  description?: string
  iconClassName?: string
}

function InfoItem({
  icon: Icon,
  title,
  description,
  iconClassName,
  className,
  ...props
}: Readonly<InfoItemProps>) {
  return (
    <div
      className={cn("flex gap-3", description ? "items-start" : "items-center", className)}
      {...props}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
          iconClassName
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

export function HowItWorksDialog({ open, onOpenChange }: Readonly<HowItWorksDialogProps>) {
  const t = useTranslations("howItWorks")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="gettingStarted" className="gap-4">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="gettingStarted" className="gap-1.5 px-2.5 py-1.5">
              <Rocket className="size-4" />
              {t("tabs.gettingStarted")}
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-1.5 px-2.5 py-1.5">
              <LayoutDashboard className="size-4" />
              {t("tabs.dashboard")}
            </TabsTrigger>
            <TabsTrigger value="transactionsBudget" className="gap-1.5 px-2.5 py-1.5">
              <Wallet className="size-4" />
              {t("tabs.transactionsBudget")}
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-1.5 px-2.5 py-1.5">
              <FileBarChart2 className="size-4" />
              {t("tabs.reports")}
            </TabsTrigger>
            <TabsTrigger value="plans" className="gap-1.5 px-2.5 py-1.5">
              <Crown className="size-4" />
              {t("tabs.plans")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gettingStarted" className="max-h-[60vh] space-y-4 overflow-y-auto">
            <section className="space-y-4 rounded-lg border p-4">
              <div className="space-y-1">
                <h3 className="font-medium">{t("gettingStarted.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("gettingStarted.description")}</p>
              </div>

              <div className="space-y-4">
                <InfoItem
                  icon={FolderPlus}
                  title={`1. ${t("gettingStarted.steps.step1.title")}`}
                  description={t("gettingStarted.steps.step1.description")}
                />
                <InfoItem
                  icon={PiggyBank}
                  title={`2. ${t("gettingStarted.steps.step2.title")}`}
                  description={t("gettingStarted.steps.step2.description")}
                />
                <InfoItem
                  icon={Receipt}
                  title={`3. ${t("gettingStarted.steps.step3.title")}`}
                  description={t("gettingStarted.steps.step3.description")}
                />
                <InfoItem
                  icon={LayoutDashboard}
                  title={`4. ${t("gettingStarted.steps.step4.title")}`}
                  description={t("gettingStarted.steps.step4.description")}
                />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="dashboard" className="max-h-[60vh] space-y-4 overflow-y-auto">
            <section className="space-y-3 rounded-lg border p-4">
              <InfoItem
                icon={Move}
                title={t("dashboard.customizable.title")}
                description={t("dashboard.customizable.description")}
              />
            </section>

            <section className="space-y-3 rounded-lg border p-4">
              <h3 className="font-medium">{t("dashboard.components.title")}</h3>
              <div className="space-y-3">
                <InfoItem icon={Gauge} title={t("dashboard.components.kpis")} />
                <InfoItem icon={BarChart3} title={t("dashboard.components.charts")} />
                <InfoItem icon={BellRing} title={t("dashboard.components.alerts")} />
                <InfoItem icon={Target} title={t("dashboard.components.budgetProgress")} />
              </div>
            </section>

            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/10">
              <Crown className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-400">{t("dashboard.premiumNote")}</p>
            </div>
          </TabsContent>

          <TabsContent value="transactionsBudget" className="max-h-[60vh] space-y-4 overflow-y-auto">
            <section className="space-y-3 rounded-lg border p-4">
              <h3 className="font-medium">{t("transactionsBudget.types.title")}</h3>
              <div className="space-y-3">
                <InfoItem
                  icon={ArrowUpCircle}
                  title={t("transactionsBudget.types.income")}
                  iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                />
                <InfoItem
                  icon={ArrowDownCircle}
                  title={t("transactionsBudget.types.expense")}
                  iconClassName="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                />
                <InfoItem
                  icon={ArrowRightLeft}
                  title={t("transactionsBudget.types.transfer")}
                  iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                />
              </div>
            </section>

            <section className="space-y-3 rounded-lg border p-4">
              <InfoItem
                icon={Repeat}
                title={t("transactionsBudget.recurring.title")}
                description={t("transactionsBudget.recurring.description")}
              />
            </section>

            <section className="space-y-3 rounded-lg border p-4">
              <div className="space-y-1">
                <h3 className="font-medium">{t("transactionsBudget.budgetStatus.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("transactionsBudget.budgetStatus.description")}
                </p>
              </div>
              <div className="space-y-3">
                <InfoItem
                  icon={CheckCircle2}
                  title={t("transactionsBudget.budgetStatus.ok")}
                  iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                />
                <InfoItem
                  icon={AlertTriangle}
                  title={t("transactionsBudget.budgetStatus.warning")}
                  iconClassName="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                />
                <InfoItem
                  icon={XCircle}
                  title={t("transactionsBudget.budgetStatus.exceeded")}
                  iconClassName="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="reports" className="max-h-[60vh] space-y-4 overflow-y-auto">
            <section className="space-y-4 rounded-lg border p-4">
              <div className="space-y-1">
                <h3 className="font-medium">{t("reports.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("reports.description")}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={FileText}
                  title={t("reports.pdf")}
                  iconClassName="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                />
                <InfoItem
                  icon={FileSpreadsheet}
                  title={t("reports.excel")}
                  iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="plans" className="max-h-[60vh] space-y-4 overflow-y-auto">
            <section className="space-y-1">
              <h3 className="font-medium">{t("plans.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("plans.description")}</p>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 rounded-lg border p-4">
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {t("plans.free.title")}
                </span>
                <p className="text-sm text-muted-foreground">{t("plans.free.description")}</p>
              </div>
              <div className="space-y-2 rounded-lg border border-amber-200 p-4 dark:border-amber-900/50">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  <Sparkles className="size-3" />
                  {t("plans.premium.title")}
                </span>
                <p className="text-sm text-muted-foreground">{t("plans.premium.description")}</p>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href="/plans">{t("plans.cta")}</Link>
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
