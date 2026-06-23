"use client";

// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PremiumUpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "iconGate" | "componentGate";
};

export function PremiumUpgradeDialog({
  open,
  onOpenChange,
  variant,
}: Readonly<PremiumUpgradeDialogProps>) {
  const t = useTranslations("premium");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`${variant}.title`)}</DialogTitle>
          <DialogDescription>{t(`${variant}.description`)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t(`${variant}.close`)}
          </Button>
          <Button asChild>
            <Link href="/plans">{t(`${variant}.seePlans`)}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
