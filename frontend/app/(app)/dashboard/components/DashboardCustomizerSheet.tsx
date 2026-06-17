"use client";

// React
import { useMemo, useState } from "react";

// Libs
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
    GripVerticalIcon,
    Columns2Icon,
    RectangleHorizontalIcon,
    InfoIcon,
} from "lucide-react";

// Components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

// Hooks
import {
    useDashboardConfig,
    useSaveDashboardConfig,
} from "../hooks/useDashboardConfig";

//context
import { useAuth } from "@/contexts/auth-context";

// Types
import type { DashboardConfigItem } from "../types";

const COMPONENT_LABELS: Record<string, string> = {
    alertsCard: "Alertas",
    quickInsightsCard: "Insights Rápidos",
    latestTransactionsCard: "Últimas Transações",
    budgetProgressCard: "Progresso de Orçamentos",
    financialRiskCard: "Risco Financeiro",
    balanceEvolutionChart: "Evolução do Saldo",
    incomeExpenseBarChart: "Receitas vs Despesas",
    categoryDistributionFlipCard: "Distribuição por Categoria",
};

type DashboardCustomizerSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function SortableItem({
    item,
    onToggleVisible,
    onToggleColumns,
}: {
    item: DashboardConfigItem;
    onToggleVisible: (key: string) => void;
    onToggleColumns: (key: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.componentKey });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 rounded-lg border bg-card p-3 ${isDragging ? "opacity-50 shadow-lg" : ""}`}
        >
            <button
                type="button"
                className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
                {...attributes}
                {...listeners}
            >
                <GripVerticalIcon className="size-4" />
            </button>

            <Checkbox
                checked={item.visible}
                onCheckedChange={() => onToggleVisible(item.componentKey)}
            />

            <span className="flex-1 text-sm font-medium">
                {COMPONENT_LABELS[item.componentKey] ?? item.componentKey}
            </span>

            <div className="flex items-center gap-1 rounded-md border p-0.5">
                <button
                    type="button"
                    onClick={() => {
                        if (item.columns !== 1) onToggleColumns(item.componentKey);
                    }}
                    className={`rounded p-1 transition-colors ${item.columns === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    title="1 coluna"
                >
                    <Columns2Icon className="size-4" />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (item.columns !== 2) onToggleColumns(item.componentKey);
                    }}
                    className={`rounded p-1 transition-colors ${item.columns === 2 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    title="2 colunas (largura total)"
                >
                    <RectangleHorizontalIcon className="size-4" />
                </button>
            </div>
        </div>
    );
}

export function DashboardCustomizerSheet({
    open,
    onOpenChange,
}: DashboardCustomizerSheetProps) {
    const { state } = useAuth();
    const userId = state.user?.userId;
    const { data: config } = useDashboardConfig(undefined, userId);
    const saveMutation = useSaveDashboardConfig(() => onOpenChange(false));
    const [draftItems, setDraftItems] = useState<DashboardConfigItem[] | null>(null);

    const sortedConfig = useMemo(
        () => (config ? [...config].sort((a, b) => a.order - b.order) : []),
        [config],
    );

    const items = draftItems ?? sortedConfig;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setDraftItems((prev) => {
            const base = prev ?? sortedConfig;
            const oldIndex = base.findIndex((i) => i.componentKey === active.id);
            const newIndex = base.findIndex((i) => i.componentKey === over.id);

            return arrayMove(base, oldIndex, newIndex);
        });
    }

    function handleToggleVisible(key: string) {
        setDraftItems((prev) => {
            const base = prev ?? sortedConfig;

            return base.map((i) =>
                i.componentKey === key ? { ...i, visible: !i.visible } : i,
            );
        });
    }

    function handleToggleColumns(key: string) {
        setDraftItems((prev) => {
            const base = prev ?? sortedConfig;

            return base.map((i) =>
                i.componentKey === key
                    ? { ...i, columns: i.columns === 1 ? 2 : 1 }
                    : i,
            );
        });
    }

    function handleSave() {
        const payload = items.map((item, index) => ({
            ...item,
            order: index,
        }));

        saveMutation.mutate(payload);
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-4 overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Customizar Dashboard</SheetTitle>
                    <SheetDescription>
                        Reordene, mostre/oculte e ajuste a largura dos componentes.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 mx-1">
                    <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
                    <span>Os KPI cards (saldo, receitas, despesas e economia) são fixos e não podem ser movidos ou ocultados.</span>
                </div>

                <div className="flex flex-col gap-2 mx-1">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map((i) => i.componentKey)}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map((item) => (
                                <SortableItem
                                    key={item.componentKey}
                                    item={item}
                                    onToggleVisible={handleToggleVisible}
                                    onToggleColumns={handleToggleColumns}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

                <SheetFooter className="mt-auto">
                    <Button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="w-full"
                    >
                        {saveMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
