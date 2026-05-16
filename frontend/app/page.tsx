import {
  ArrowDownRight,
  ArrowRightLeft,
  ArrowUpRight,
  BadgeDollarSign,
  BusFront,
  CircleDollarSign,
  Coffee,
  MoreHorizontal,
  PiggyBank,
  Plus,
  ReceiptText,
  ShoppingBag,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const summaryCards = [
  {
    label: "Saldo atual",
    value: "R$ 3.240",
    description: "Disponível para este mês",
    icon: Wallet,
    trend: "+12% em relação ao mês passado",
    tone: "text-foreground",
  },
  {
    label: "Receitas do mês",
    value: "R$ 5.000",
    description: "Entradas confirmadas",
    icon: ArrowUpRight,
    trend: "+8 lançamentos novos",
    tone: "text-emerald-500",
  },
  {
    label: "Despesas do mês",
    value: "R$ 1.760",
    description: "Saídas recorrentes e variáveis",
    icon: ArrowDownRight,
    trend: "-4% frente ao planejamento",
    tone: "text-orange-500",
  },
  {
    label: "Meta de economia",
    value: "R$ 1.120",
    description: "79% da meta mensal concluída",
    icon: PiggyBank,
    trend: "Restam R$ 280 para bater a meta",
    tone: "text-sky-500",
  },
]

const recentTransactions = [
  {
    title: "Salário",
    category: "Renda",
    amount: "+R$ 5.000",
    icon: CircleDollarSign,
    tone: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Mercado",
    category: "Alimentação",
    amount: "-R$ 320",
    icon: ShoppingBag,
    tone: "bg-orange-500/10 text-orange-500",
  },
  {
    title: "Combustível",
    category: "Transporte",
    amount: "-R$ 180",
    icon: BusFront,
    tone: "bg-sky-500/10 text-sky-500",
  },
  {
    title: "Streaming",
    category: "Lazer",
    amount: "-R$ 55",
    icon: ReceiptText,
    tone: "bg-violet-500/10 text-violet-500",
  },
]

const categories = [
  { name: "Alimentação", amount: "R$ 320", progress: 78, accent: "bg-violet-500" },
  { name: "Transporte", amount: "R$ 180", progress: 52, accent: "bg-sky-500" },
  { name: "Renda", amount: "R$ 5.000", progress: 96, accent: "bg-emerald-500" },
  { name: "Lazer", amount: "R$ 55", progress: 24, accent: "bg-orange-500" },
]

const transactionsTable = [
  {
    date: "16 mai",
    description: "Salário mensal",
    category: "Renda",
    type: "Entrada",
    amount: "+R$ 5.000",
    status: "Confirmado",
  },
  {
    date: "15 mai",
    description: "Supermercado da semana",
    category: "Alimentação",
    type: "Saída",
    amount: "-R$ 320",
    status: "Conciliado",
  },
  {
    date: "14 mai",
    description: "Abastecimento",
    category: "Transporte",
    type: "Saída",
    amount: "-R$ 180",
    status: "Conciliado",
  },
  {
    date: "13 mai",
    description: "Assinatura de streaming",
    category: "Lazer",
    type: "Saída",
    amount: "-R$ 55",
    status: "Pendente",
  },
]

export default function Page() {
  return (
    <div className="relative min-h-[calc(100vh-var(--header-height))] overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_32%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
        
        {/* <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard</h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Acompanhe saldo, entradas, saídas e categorias em uma visão rápida e responsiva.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <MoreHorizontal className="size-4" />
              Ações
            </Button>
            <Button size="sm" className="shadow-sm shadow-primary/20">
              <Plus className="size-4" />
              Nova transação
            </Button>
          </div>
        </section> */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon

            return (
              <Card key={card.label} className="border-border/70 bg-card/90 backdrop-blur @container/card">
                <CardHeader className="space-y-0 pb-2">
                  <CardDescription>{card.label}</CardDescription>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-2xl font-semibold tabular-nums @[220px]/card:text-3xl">
                      {card.value}
                    </CardTitle>
                    <div className={`rounded-full border border-border/60 p-2 ${card.tone}`}>
                      <Icon className="size-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                  <p className="flex items-center gap-1 text-sm font-medium text-foreground/80">
                    <ArrowUpRight className="size-4 text-emerald-500" />
                    {card.trend}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-12">
          <Card className="xl:col-span-7 border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>Últimas transações</CardTitle>
                <CardDescription>Resumo dos lançamentos mais recentes no mês</CardDescription>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">
                Atualizado agora
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              {recentTransactions.map((transaction, index) => {
                const Icon = transaction.icon

                return (
                  <div key={transaction.title}>
                    <div className="flex items-center gap-3">
                      <div className={`flex size-11 items-center justify-center rounded-xl ${transaction.tone}`}>
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium leading-none">{transaction.title}</p>
                          <Badge variant="secondary" className="rounded-full">
                            {transaction.category}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Lançamento recorrente e já categorizado
                        </p>
                      </div>

                      <span
                        className={`text-sm font-medium tabular-nums ${transaction.amount.startsWith("+") ? "text-emerald-500" : "text-orange-500"}`}
                      >
                        {transaction.amount}
                      </span>
                    </div>

                    {index < recentTransactions.length - 1 ? <Separator className="mt-4" /> : null}
                  </div>
                )
              })}
            </CardContent>

            <CardFooter className="justify-between gap-3">
              <p className="text-sm text-muted-foreground">Mostrando 4 de 18 transações deste mês.</p>
              <Button variant="outline" size="sm">
                Ver tudo
                <ArrowRightLeft className="size-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="xl:col-span-5 border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="space-y-1">
              <CardTitle>Categorias</CardTitle>
              <CardDescription>Distribuição atual das despesas e entradas</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`size-2.5 rounded-full ${category.accent}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground tabular-nums">{category.amount}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${category.accent}`}
                      style={{ width: `${category.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="size-4" />
                Nova categoria
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-12">
          <Card className="xl:col-span-8 border-border/70 bg-card/90 backdrop-blur">
            <CardHeader>
              <CardTitle>Extrato recente</CardTitle>
              <CardDescription>Tabela responsiva para conferir entradas e saídas</CardDescription>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsTable.map((item) => (
                    <TableRow key={`${item.date}-${item.description}`}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium leading-none">{item.description}</p>
                          <p className="text-xs text-muted-foreground">{item.status}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.type === "Entrada" ? "default" : "outline"}
                          className="rounded-full"
                        >
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium tabular-nums ${item.amount.startsWith("+") ? "text-emerald-500" : "text-orange-500"}`}
                      >
                        {item.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="xl:col-span-4 border-border/70 bg-card/90 backdrop-blur">
            <CardHeader>
              <CardTitle>Indicadores rápidos</CardTitle>
              <CardDescription>Atalhos para leitura do cenário atual</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <BadgeDollarSign className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Média diária</p>
                    <p className="text-lg font-semibold tabular-nums">R$ 126</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-sky-500/10 p-2 text-sky-500">
                    <ArrowRightLeft className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transações pendentes</p>
                    <p className="text-lg font-semibold tabular-nums">3 itens</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-500/10 p-2 text-orange-500">
                    <Coffee className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maior gasto do mês</p>
                    <p className="text-lg font-semibold tabular-nums">Alimentação</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
