"use client";

// react
import { useCallback } from "react";

// react-query
import { useMutation } from "@tanstack/react-query";

// hooks
import { useAuth } from "@/contexts/auth-context";

// apis
import { upgradeUserToPremium } from "@/lib/services/user.service";

// utils
import { setClientUserDataCookie } from "@/lib/client-auth";

export const useUpgradeToPremium = () => {
  const { state, dispatch } = useAuth();

  const mutation = useMutation({
    mutationFn: upgradeUserToPremium,
    onSuccess: (data) => {
      const updatedUser = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        isPremium: data.isPremium,
      };

      setClientUserDataCookie(updatedUser);

      dispatch({ type: "LOGIN", payload: updatedUser });
    },
  });

  const isPremium = state.user?.isPremium ?? false;

  const upgrade = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  return {
    isPremium,
    upgrade,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message ?? null,
  };
};
