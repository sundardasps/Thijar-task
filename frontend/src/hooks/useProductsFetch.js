import { useQuery } from "@tanstack/react-query";
import { getProductsAPI } from "../api/modules/product.api";

export function useProductsFetch({ searchValue, limit, page }) {

  


  const { data, isLoading } = useQuery({
    queryKey: ["products", page, searchValue],

    queryFn: () => getProductsAPI({ page, search: searchValue, limit }),
    keepPreviousData: true,
  });

  return { data, isLoading };
}


