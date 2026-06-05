"use client";

// Libs
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Types
import type { DashboardBalanceEvolutionPoint } from "../types";

type BalanceEvolutionChartProps = {
  data: DashboardBalanceEvolutionPoint[];
};

const chartConfig = {
  balance: {
    label: "Saldo",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function BalanceEvolutionChart({ data }: BalanceEvolutionChartProps) {
  const chartData = data.map((point) => ({
    date: new Date(point.date).getDate().toString().padStart(2, "0"),
    balance: point.balance,
  }));

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>Evolução de saldo</CardTitle>
        <CardDescription>Saldo acumulado ao longo do mês</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
              }
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="url(#fillBalance)"
              stroke="var(--color-balance)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
