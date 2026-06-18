"use client";

// React
import { useMemo, useState } from "react";

// next-intl
import { useTranslations } from "next-intl";

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
    LockIcon,
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

import { Badge } from "@/components/ui/badge";

import { PremiumUpgradeDialog } from "@/components/shared/premium-upgrade-dialog";

// Hooks
import {
    useDashboardConfig,
    useSaveDashboardConfig,
} from "../hooks/useDashboardConfig";

//context
import { useAuth } from "@/contexts/auth-context";

// Types
import type { DashboardConfigItem } from "../types";

// Constants
import { PREMIUM_COMPONENT_KEYS } from "./DashboardScreen";

type DashboardCustomizerSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function SortableItem({
    item,
    isPremiumUser,
    onToggleVisible,
    onToggleColumns,
    onPremiumLockClick,
}: {
    item: DashboardConfigItem;
    isPremiumUser: boolean;
    onToggleVisible: (key: string) => void;
    onToggleColumns: (key: string) => void;
    onPremiumLockClick: () => void;
}) {
    const t = useTranslations("dashboard");

    const isPremiumComponent = PREMIUM_COMPONENT_KEYS.includes(item.componentKey);
    const isLocked = isPremiumComponent && !isPremiumUser;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.componentKey,
        disabled: isLocked,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 rounded-lg border bg-card p-3 ${isDragging ? "opacity-50 shadow-lg" : ""} ${isLocked ? "opacity-70" : ""}`}
        >
            <button
                type="button"
                className={`touch-none text-muted-foreground ${isLocked ? "cursor-not-allowed" : "cursor-grab hover:text-foreground"}`}
                {...(!isLocked ? attributes : {})}
                {...(!isLocked ? listeners : {})}
                onClick={isLocked ? onPremiumLockClick : undefined}
            >
                {isLocked ? (
                    <LockIcon className="size-4" />
                ) : (
                    <GripVerticalIcon className="size-4" />
                )}
            </button>

            <Checkbox
                checked={item.visible}
                onCheckedChange={() => {
                    if (isLocked) {
                        onPremiumLockClick();

                        return;
                    }
                    
                    onToggleVisible(item.componentKey);
                }}
                disabled={isLocked}
            />

            <span className="flex-1 text-sm font-medium">
                {t(`customizer.components.${item.componentKey}`)}
            </span>

            {isPremiumComponent && (
                <Badge
                    variant={isPremiumUser ? "default" : "secondary"}
                    className="text-xs cursor-default"
                    onClick={isLocked ? onPremiumLockClick : undefined}
                >
                    {t("customizer.premiumBadge")}
                </Badge>
            )}

            <div className={`flex items-center gap-1 rounded-md border p-0.5 ${isLocked ? "opacity-50 pointer-events-none" : ""}`}>
                <button
                    type="button"
                    onClick={() => {
                        if (isLocked || item.columns !== 1) return;
                        onToggleColumns(item.componentKey);
                    }}
                    disabled={isLocked}
                    className={`rounded p-1 transition-colors ${item.columns === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    title={t("customizer.columnOne")}
                >
                    <Columns2Icon className="size-4" />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (isLocked || item.columns !== 2) return;
                        onToggleColumns(item.componentKey);
                    }}
                    disabled={isLocked}
                    className={`rounded p-1 transition-colors ${item.columns === 2 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    title={t("customizer.columnTwo")}
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
    const t = useTranslations("dashboard");

    const { state } = useAuth();
    const userId = state.user?.userId;
    const isPremiumUser = state.user?.isPremium ?? false;
    const { data: config } = useDashboardConfig(undefined, userId);
    const saveMutation = useSaveDashboardConfig(() => onOpenChange(false));
    const [draftItems, setDraftItems] = useState<DashboardConfigItem[] | null>(null);
    const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);

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
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="flex flex-col gap-4 overflow-y-auto sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>{t("customizer.title")}</SheetTitle>
                        <SheetDescription>{t("customizer.description")}</SheetDescription>
                    </SheetHeader>

                    <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 mx-1">
                        <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
                        <span>{t("customizer.fixedKpisInfo")}</span>
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
                                        isPremiumUser={isPremiumUser}
                                        onToggleVisible={handleToggleVisible}
                                        onToggleColumns={handleToggleColumns}
                                        onPremiumLockClick={() => setPremiumDialogOpen(true)}
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
                            {saveMutation.isPending ? t("customizer.saving") : t("customizer.save")}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <PremiumUpgradeDialog
                open={premiumDialogOpen}
                onOpenChange={setPremiumDialogOpen}
                variant="componentGate"
            />
        </>
    );
}
