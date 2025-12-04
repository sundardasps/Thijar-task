import { useEffect, useRef, useState } from "react";
import { FloatingInput } from "../../ui/input";
import { ROUNDED, BORDER } from "../../../styles/constents";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductsInfiniteAPI } from "../../../api/modules/product.api";

export function SearchableItemInput({
  label,
  showDropdown,
  setShowDropdown,
  onItemSelect,
}) {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  /* ---------------- SEARCH with Debounce ---------------- */
  const [rawSearch, setRawSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Setting searchValue to:", rawSearch);
      setSearchValue(rawSearch);
    }, 500);

    return () => clearTimeout(timeout);
  }, [rawSearch]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  const handleInputChange = (e) => {
    console.log("Input changed:", e.target.value);
    setRawSearch(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = (item) => {
    onItemSelect(item);
    setShowDropdown(false);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    error,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["products-infinite", searchValue],
    queryFn: ({ pageParam }) => {
      console.log(
        "API called with searchValue:",
        searchValue,
        "pageParam:",
        pageParam
      );
      return getProductsInfiniteAPI({
        cursor: pageParam,
        limit: 20,
        categoryId: "",
        search: searchValue,
      }).then((res) => {
        console.log("API response:", res.data);
        return res.data;
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasMore ? lastPage.data.nextCursor : undefined,
    enabled: true,
    staleTime: 0,
  });

  const products = data?.pages?.flatMap((p) => p.data.items) ?? [];

  useEffect(() => {
    console.log("Query status:", {
      status,
      isLoading,
      isFetching,
      error,
      productsCount: products.length,
      searchValue,
    });
  }, [status, isLoading, isFetching, error, products.length, searchValue]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <FloatingInput
          ref={inputRef}
          type="text"
          value={rawSearch}
          onChange={handleInputChange}
          onFocus={() => products.length > 0 && setShowDropdown(true)}
          label={label}
        />
        {/* Loading indicator */}
        {(isLoading || isFetching) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showDropdown && products.length > 0 && (
        <ul
          className={`${ROUNDED} ${BORDER} bg-white absolute z-50 w-full mt-1 shadow-xl max-h-60 overflow-auto`}
        >
          {products.map((item, index) => (
            <li
              key={`${item.id}-${index}`} // Better key using id if available
              className="border-b border-gray-300 flex justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 last:border-b-0"
              onClick={() => handleSelect(item)}
            >
              <div className="font-medium">{item?.name}</div>
              <div className="text-sm font-semibold text-blue-600">
                {item?.retailRate}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute w-full mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          Error loading products: {error.message}
        </div>
      )}

      {/* No results message */}
      {showDropdown &&
        !isLoading &&
        !isFetching &&
        searchValue &&
        products.length === 0 && (
          <div className="absolute w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded text-gray-600 text-sm">
            No products found
          </div>
        )}
    </div>
  );
}
