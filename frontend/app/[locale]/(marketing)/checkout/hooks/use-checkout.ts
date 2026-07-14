"use client";

// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// next-intl
import { useTranslations } from "next-intl";

// sonner
import { toast } from "sonner";

// hooks
import { useAuth } from "@/contexts/auth-context";

// apis
import { upgradeUserToPremium } from "@/lib/services/user.service";

// utils
import { setClientUserDataCookie } from "@/lib/client-auth";

export const useCheckout = () => {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { dispatch } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

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

  return { isLoading, handleSubmit };
};
