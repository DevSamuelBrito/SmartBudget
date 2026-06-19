// react
import { render, screen } from "@testing-library/react";

// components
import { FinancialRiskCard } from "@/app/[locale]/(app)/dashboard/components/FinancialRiskCard";

// types
import type { DashboardFinancialRisk } from "@/app/[locale]/(app)/dashboard/types";

jest.mock("next-intl", () => ({
  useTranslations:
    (_ns: string) =>
    (key: string, params?: Record<string, string>) => {
      if (key === "charts.financialRisk.riskMessage") {
        return `Alerta: seus gastos fixos representam ${params?.percentageLabel} da sua renda média.`;
      }
      const map: Record<string, string> = {
        "charts.financialRisk.title": "Risco financeiro",
        "charts.financialRisk.description":
          "Gastos fixos sobre a renda média dos últimos 3 meses",
        "charts.financialRisk.okMessage":
          "Seus gastos fixos estão sob controle.",
        "charts.financialRisk.warningMessage":
          "Atenção: seus gastos fixos estão se aproximando do limite recomendado.",
        "charts.financialRisk.noDataMessage":
          "Sem dados suficientes para calcular o risco financeiro.",
        "charts.financialRisk.averageIncome": "Renda média (3 meses)",
        "charts.financialRisk.fixedExpenses": "Gastos fixos mensais",
        "charts.financialRisk.status.ok": "Ok",
        "charts.financialRisk.status.warning": "Atenção",
        "charts.financialRisk.status.risk": "Risco",
        "charts.financialRisk.status.noData": "Sem dados",
      };
      return map[key] ?? key;
    },
}));

jest.mock("lucide-react", () => ({
  ShieldAlert: () => null,
}));

jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }: { value?: number }) => (
    <div role="progressbar" aria-valuenow={value ?? 0} />
  ),
}));

jest.mock("@/lib/utils/formatters", () => ({
  formatCurrency: (value: number) =>
    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
}));

const makeRisk = (
  overrides: Partial<DashboardFinancialRisk> = {}
): DashboardFinancialRisk => ({
  averageIncome: 5000,
  fixedExpenses: 2000,
  percentage: 40,
  status: "Ok",
  ...overrides,
});

describe("FinancialRiskCard", () => {
  it("renderiza corretamente com status Ok", () => {
    render(<FinancialRiskCard financialRisk={makeRisk()} />);

    expect(
      screen.getByText("Seus gastos fixos estão sob controle.")
    ).toBeInTheDocument();
    expect(screen.getByText("Ok")).toBeInTheDocument();
  });

  it("renderiza corretamente com status Risk exibindo alerta", () => {
    render(
      <FinancialRiskCard
        financialRisk={makeRisk({ status: "Risk", percentage: 85 })}
      />
    );

    expect(
      screen.getByText(/Alerta: seus gastos fixos representam/)
    ).toBeInTheDocument();
    expect(screen.getByText("Risco")).toBeInTheDocument();
  });

  it("renderiza corretamente com status NoData exibindo mensagem de sem dados", () => {
    render(
      <FinancialRiskCard
        financialRisk={makeRisk({ status: "NoData", percentage: 0 })}
      />
    );

    expect(
      screen.getByText(
        "Sem dados suficientes para calcular o risco financeiro."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Sem dados")).toBeInTheDocument();
  });

  it("exibe averageIncome e fixedExpenses formatados corretamente", () => {
    render(
      <FinancialRiskCard
        financialRisk={makeRisk({ averageIncome: 5000, fixedExpenses: 2000 })}
      />
    );

    expect(screen.getByText(/R\$.*5\.000/)).toBeInTheDocument();
    expect(screen.getByText(/R\$.*2\.000/)).toBeInTheDocument();
  });
});
