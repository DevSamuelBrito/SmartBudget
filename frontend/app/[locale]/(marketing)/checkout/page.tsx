"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";

import { useRouter } from "next/navigation";

// next-intl
import { useTranslations } from "next-intl";

// sonner
import { toast } from "sonner";

// lucide-react
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

// hooks
import { useAuth } from "@/contexts/auth-context";

// apis
import { upgradeUserToPremium } from "@/lib/services/user.service";

// utils
import { setClientUserDataCookie } from "@/lib/client-auth";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { dispatch } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);

    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length >= 3) {

      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const data = await upgradeUserToPremium();

      const updatedUser = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        isPremium: data.isPremium,
      };

      setClientUserDataCookie(updatedUser);
      dispatch({ type: "LOGIN", payload: updatedUser });
      toast.success(t("successToast"));
      router.push("/dashboard");
    } catch {
      toast.error(t("errorToast"));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div>
        <Button
          variant="ghost"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/plans">
            <ArrowLeft className="h-4 w-4" />
            {t("backToPlans")}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
          </div>

          {/* Plan summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("planSummary.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("planSummary.plan")}</span>
                <span className="font-semibold">Premium</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("planSummary.price")}</span>
                <div className="flex items-center gap-2">
                  <span className="line-through text-muted-foreground text-xs">
                    {t("planSummary.originalPrice")}
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {t("planSummary.free")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">{t("form.cardName")}</Label>
              <Input
                id="cardName"
                placeholder={t("form.cardNamePlaceholder")}
                autoComplete="cc-name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">{t("form.cardNumber")}</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  autoComplete="cc-number"
                  inputMode="numeric"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">{t("form.expiry")}</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  maxLength={5}
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">{t("form.cvv")}</Label>
                <Input
                  id="cvv"
                  placeholder="CVV"
                  maxLength={4}
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
