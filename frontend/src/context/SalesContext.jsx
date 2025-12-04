import { createContext, useContext, useState } from "react";
import { unitOptions } from "../utils/constants";

const SalesContext = createContext();

export function SalesProvider({ children }) {
  const [salesTableItems, setSalesTableItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const normalize = (item) => {
    const qty = Number(item.qty ?? 1);

    const price =
      item.price !== undefined
        ? Number(item.price)
        : item.retailRate !== undefined
        ? Number(item.retailRate)
        : 0;

    return {
      name: item.name ?? "",
      qty,
      price,
      unitList: item.unitList ?? unitOptions,
      unit: item.unit ?? "Box",
      amount: Number((qty * price).toFixed(3)),
      taxRate: item.tax || 0,
      discountAmount: item.discountAmount || 0,
      retailTaxMode: item.retailTaxMode || "include",
    };
  };

  const addItemToTable = (item) => {
    setSalesTableItems((prev) => {
      const existingIndex = prev.findIndex(
        (row) => row.name.toLowerCase() === item.name.toLowerCase()
      );

      // 1️⃣ If item already exists → increase qty only
      if (existingIndex !== -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];

        updated[existingIndex] = {
          ...existing,
          qty: existing.qty + 1,
          amount: Number(((existing.qty + 1) * existing.price).toFixed(3)),
        };

        setSelectedIndex(existingIndex);
        return updated;
      }

      // 2️⃣ New item → normalize with correct price
      const normalized = {
        name: item.name,
        qty: 1,
        price: Number(item.retailRate ?? item.price ?? 0), // IMPORTANT
        unitList: unitOptions,
        unit: "Box",
        amount: Number((1 * (item.retailRate ?? item.price ?? 0)).toFixed(3)),
        taxRate: item.tax || 0,
        discountAmount: item.discountAmount || 0,
        retailTaxMode: item.retailTaxMode || "include",
      };

      setSelectedIndex(prev.length);
      return [...prev, normalized];
    });
  };

  // UPDATE ROW
  const updateRow = (index, patch) => {
    setSalesTableItems((prev) =>
      prev.map((row, i) =>
        i === index ? normalize({ ...row, ...patch }) : row
      )
    );
  };

  // DELETE SELECTED ROW
  const deleteSelectedRow = () => {
    if (selectedIndex === null) return;

    setSalesTableItems((prev) => {
      const updated = prev.filter((_, i) => i !== selectedIndex);
      return updated;
    });

    setSelectedIndex(null);
  };

  // DELETE ALL
  const deleteAll = () => {
    setSalesTableItems([]);
    setSelectedIndex(null);
  };

  const increaseQty = () => {
    if (selectedIndex === null) return;

    const item = salesTableItems[selectedIndex];

    updateRow(selectedIndex, {
      qty: item.qty + 1,
      price: item.price, // keep same price
    });
  };

  const decreaseQty = () => {
    if (selectedIndex === null) return;

    const item = salesTableItems[selectedIndex];

    if (item.qty > 1) {
      updateRow(selectedIndex, {
        qty: item.qty - 1,
        price: item.price, // keep same price
      });
    }
  };

  // Add next available product that is NOT already in salesTableItems
  const addNextAvailableProduct = (products) => {
    if (!products || products.length === 0) return;

    const existingNames = new Set(salesTableItems.map((item) => item.name));

    // Find first product not already in table
    const next = products.find((p) => !existingNames.has(p.name));

    if (!next) {
      console.log("All products already in table");
      return;
    }

    addItemToTable(next);
  };

  return (
    <SalesContext.Provider
      value={{
        salesTableItems,
        setSalesTableItems,
        addItemToTable,
        selectedIndex,
        setSelectedIndex,
        updateRow,
        deleteSelectedRow,
        deleteAll,
        increaseQty,
        decreaseQty,
        addNextAvailableProduct,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export const useSales = () => useContext(SalesContext);
