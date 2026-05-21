//libs
import { api } from "@/lib/axios";

export const getCategories = async () => {
  const response = await api.get("/transactionCategories");

  return response.data;
};
