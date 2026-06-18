"use client";

// next-intl
import { useTranslations } from "next-intl";

// Libs
import { AlertTriangle, XCircle } from "lucide-react";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types
import type { DashboardAlert } from "../types";

type AlertsCardProps = {
  alerts: DashboardAlert[];
};

export function AlertsCard({ alerts }: AlertsCardProps) {
  const t = useTranslations("dashboard");

  if (alerts.length === 0) return null;

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-500" />
          {t("alerts.title")}
        </CardTitle>
        <CardDescription>{t("alerts.description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const isExceeded = alert.type === "BudgetExceeded";

          return (
            <div
              key={`${alert.budgetId}-${alert.type}`}
              className={`flex items-start gap-3 rounded-lg border p-3 ${isExceeded
                  ? "border-rose-500/30 bg-rose-500/5"
                  : "border-amber-500/30 bg-amber-500/5"
                }`}
            >
              {isExceeded ? (
                <XCircle className="mt-0.5 size-4 shrink-0 text-rose-500" />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{alert.categoryName}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </div>
              <Badge
                variant="outline"
                className={isExceeded ? "border-rose-500/50 text-rose-500" : "border-amber-500/50 text-amber-500"}
              >
                {alert.percentage.toFixed(0)}%
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
