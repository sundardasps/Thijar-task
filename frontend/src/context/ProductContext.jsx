import { createContext, useContext, useState, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getProductsInfiniteAPI } from "../api/modules/product.api";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const queryClient = useQueryClient();

  const [categoryId, setCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["products-infinite", categoryId],
    queryFn: ({ pageParam }) =>
      getProductsInfiniteAPI({
        cursor: pageParam,
        limit: 20,
        categoryId,
        search: searchTerm,
      }).then((res) => res.data),

    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasMore ? lastPage.data.nextCursor : undefined,
  });

  useEffect(() => {
    queryClient.resetQueries({
      queryKey: ["products-infinite"],
    });
  }, [categoryId]);

  const products = data?.pages?.flatMap((p) => p.data.items) ?? [];

  return (
    <ProductContext.Provider
      value={{
        data,
        isLoading,
        categoryId,
        setCategoryId,
        products,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
