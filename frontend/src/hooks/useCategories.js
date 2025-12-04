import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI } from "../api/modules/category.api";

export function useCategories() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategoriesAPI();
      return res?.data?.data ?? res?.data ?? [];
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
}
