import { useState, useMemo } from "react";
import { DateBox } from "../../ui/date";
import { FloatingInput } from "../../ui/input";
import { SelectBox } from "../../ui/select";
import { SearchableItemInput } from "./SearchableItemInput";
import { BarcodeInput } from "./BarcodeInput";
import HeaderTab from "../common/Header";
import { BORDER, ROUNDED } from "../../../styles/constents";
import SalesTable from "./Table";
import { useSales } from "../../../context/SalesContext";
import { useProducts } from "../../../context/ProductContext";

export default function SalesContainer() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const { products } = useProducts();

  const {
    addItemToTable,
    salesTableItems,
    updateRow,
    setSelectedIndex,
    selectedIndex,
    addNextAvailableProduct,
  } = useSales();

  console.log(salesTableItems, "///calculation test.");

  // Calculate totals with tax and discount
  const calculations = useMemo(() => {
    let totalQty = 0;
    let totalTax = 0;
    let totalTaxable = 0;
    let totalDiscount = 0;
    let totalAmount = 0;

    salesTableItems.forEach((item) => {
      const qty = item.qty || 0;
      const price = item.price || item.retailRate || 0;
      const taxRate = item.tax || 0;
      const discountAmount = item.discountAmount || 0;
      const retailTaxMode = item.retailTaxMode || "include";

      // Calculate line total before discount
      const lineTotal = qty * price;

      // Calculate discount for this line
      const lineDiscount = discountAmount * qty;
      totalDiscount += lineDiscount;

      // Amount after discount
      const amountAfterDiscount = lineTotal - lineDiscount;

      if (retailTaxMode === "include") {
        // Tax is included in the price
        // Calculate taxable amount (price without tax)
        const taxableLine = amountAfterDiscount / (1 + taxRate / 100);
        const taxLine = amountAfterDiscount - taxableLine;

        totalTaxable += taxableLine;
        totalTax += taxLine;
        totalAmount += amountAfterDiscount;
      } else {
        // Tax is excluded (added on top)
        const taxLine = (amountAfterDiscount * taxRate) / 100;

        totalTaxable += amountAfterDiscount;
        totalTax += taxLine;
        totalAmount += amountAfterDiscount + taxLine;
      }

      totalQty += qty;
    });

    return {
      totalQty: totalQty.toFixed(0),
      totalTax: totalTax.toFixed(3),
      totalTaxable: totalTaxable.toFixed(3),
      totalDiscount: totalDiscount.toFixed(3),
      totalAmount: totalAmount.toFixed(3),
    };
  }, [salesTableItems]);

  return (
    <div className="w-full lg:w-[70%]">
      {/* HEADER - No border */}
      <HeaderTab title="Sales" />

      {/* CONTENT - Border only on content area */}
      <div className="p-3 flex flex-col gap-3 lg:text-[10px] 2xl:text-sm">
        {/* TOP SECTION */}
        <div className="flex md:flex-row flex-col gap-3">
          <FloatingInput label="Invoice No" />
          <FloatingInput label="User" />
          <DateBox
            defaultValue="2025-11-18"
            className="md:ml-10 w-full md:max-w-min"
          />
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput label="Customer Name" />
          <SelectBox defaultValue="Cash">
            {["Cash", "Card", "UPI", "Credit"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </SelectBox>
        </div>

        {/* PHONE */}
        <FloatingInput label="Phone" />

        {/* BARCODE + ITEM */}
        <div className="grid grid-cols-2 gap-3">
          {/* Updated Barcode Input with API integration */}
          <BarcodeInput onItemSelect={addItemToTable} />

          <SearchableItemInput
            label="Item"
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            onItemSelect={(item) => {
              addItemToTable(item);
            }}
          />
        </div>

        {/* SALES TABLE */}
        <SalesTable
          addItemToTable={addItemToTable}
          salesTableItems={salesTableItems}
          updateSalesRow={updateRow}
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
          addNextAvailableProduct={addNextAvailableProduct}
          products={products}
        />

        {/* Totals */}
        <div className="w-full bg-blue-900 text-white flex font-semibold -mt-4 lg:text-[10px] 2xl:text-sm">
          <div className="border-r border-blue-300 flex-6 text-end p-2">
            TOTAL QTY
          </div>
          <div className="border-r border-blue-300 flex-2 text-end p-2">
            {calculations.totalQty}
          </div>
          <div className="border-r border-blue-300 flex-6 text-end p-2">
            TOTAL AMOUNT
          </div>
          <div className="flex-2 text-end p-2">{calculations.totalAmount}</div>
        </div>

        {/* Tax & Discount */}
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput
            label="Total Tax"
            className="text-end"
            value={calculations.totalTax}
            readOnly
          />
          <FloatingInput
            label="Total Taxable"
            className="text-end"
            value={calculations.totalTaxable}
            readOnly
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FloatingInput
            label="Total Discount"
            className="text-end"
            value={calculations.totalDiscount}
            readOnly
          />
          <FloatingInput label="Adjustment" className="text-end" />
        </div>

        {/* Final Total */}
        <div
          className={`${ROUNDED} ${BORDER} bg-yellow-100 ml-auto w-40 px-5 py-1 text-end font-bold`}
        >
          {calculations.totalAmount}
        </div>
      </div>
    </div>
  );
}
