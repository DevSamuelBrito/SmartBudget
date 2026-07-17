// react-query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Libs
import { toast } from "sonner";

// APIs / Services
import { getDashboardConfig } from "../services/dashboard.service";

import { saveDashboardConfigAction } from "../actions/dashboard.actions";

// Types
import type { DashboardConfigItem } from "../types";

export function useDashboardConfig(
  initialData?: DashboardConfigItem[],
  userId?: string,
) {
  return useQuery<DashboardConfigItem[]>({
    queryKey: ["dashboard-config", userId],
    queryFn: getDashboardConfig,
    initialData,
    staleTime: Infinity,
  });
}

export function useSaveDashboardConfig(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: DashboardConfigItem[]) => {
      const result = await saveDashboardConfigAction(items);

      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard-config"] });
      toast.success("Dashboard customizado com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
