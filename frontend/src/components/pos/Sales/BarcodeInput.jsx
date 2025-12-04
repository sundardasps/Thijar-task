import { useState } from "react";
import { FloatingInput } from "../../ui/input";
import { getProductsByBarcodeAPI } from "../../../api/modules/product.api";

export function BarcodeInput({ onItemSelect }) {
  const [barcode, setBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBarcodeSearch = async () => {
    if (!barcode.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await getProductsByBarcodeAPI(barcode.trim());
      const product = response.data?.data;

      if (product) {
        // Add item to table
        onItemSelect(product);
        // Clear barcode input after successful add
        setBarcode("");
      }
    } catch (err) {
      // Handle error
      const errorMessage = err.response?.data?.message || "Product not found";
      setError(errorMessage);

      // Auto-clear error after 3 seconds
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBarcodeSearch();
    }
  };

  const handleChange = (e) => {
    setBarcode(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="relative">
      <FloatingInput
        label="Bar Code"
        value={barcode}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute w-full mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
