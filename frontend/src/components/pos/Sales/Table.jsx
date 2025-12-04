import { BORDER, CHECKBOX_CLASS } from "../../../styles/constents";
import { SelectBox } from "../../ui/select";
import { Input } from "../../ui/input";
import { PlusIcon } from "lucide-react";

// Reusable classes
const TD_CLASS = `${BORDER} p-1 align-middle`;
const HOVER_BG = "group-hover:bg-white";
const ROW_HOVER_BG = "group hover:bg-gray-100";

export const AddItemButton = ({ onClick, className, text = "Add row" }) => (
  <button onClick={onClick} className={className ? className : ""}>
    <PlusIcon className="w-5 h-5  lg:w-3 lg:h-3 2xl:w-5 2xl:h-5" />
    {text}
  </button>
);

export default function SalesTable({
  salesTableItems,
  updateSalesRow,
  setSelectedIndex,
  selectedIndex,
  addNextAvailableProduct,
  products,
}) {
  return (
    <div className="w-full  space-y-4 overflow-x-auto md:overflow-none  ">
      <table className="w-max md:w-full table-auto  ">
        <colgroup>
          <col style={{ width: "50px" }} />
          <col style={{ width: "200px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "110px" }} />
          <col style={{ width: "180px" }} />
          <col style={{ width: "100px" }} />
        </colgroup>

        {/* HEADER */}
        <thead className="bg-blue-900 text-white ">
          <tr>
            {["#", "ITEM NAME", "QTY", "PRICE", "UNIT", "AMOUNT"].map(
              (label, i) => (
                <th
                  key={i}
                  className={`border font-semibold border-blue-300 px-1.5 py-2 lg:text-[10px] 2xl:text-sm  ${
                    i === 0
                      ? "text-center"
                      : i === 1
                      ? "text-left"
                      : i === 4
                      ? "text-start"
                      : "text-right"
                  }`}
                >
                  {label}
                </th>
              )
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="lg:text-[10px] 2xl:text-sm">
          {salesTableItems.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 italic text-center text-gray-600">
                No items added yet
              </td>
            </tr>
          ) : (
            salesTableItems.map((item, idx) => (
              <tr key={idx} className={ROW_HOVER_BG}>
                {/* Checkbox */}
                <td className={`${TD_CLASS} text-center`}>
                  <input
                    name="rowSelector"
                    type="radio"
                    className={CHECKBOX_CLASS}
                    checked={selectedIndex === idx}
                    onChange={() => setSelectedIndex(idx)}
                    onClick={(e) => e.stopPropagation()} // prevent row click firing twice
                  />
                </td>

                {/* Item Name */}
                <td className={TD_CLASS}>
                  <Input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateSalesRow(idx, { name: e.target.value })
                    }
                    className={`${HOVER_BG} w-full border rounded uppercase `}
                    placeholder="Item name"
                  />
                </td>

                {/* Qty */}
                <td className={TD_CLASS}>
                  <Input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) =>
                      updateSalesRow(idx, {
                        qty: Number(e.target.value || 0),
                        amount: Number(
                          (
                            Number(e.target.value || 0) * item.price || 0
                          ).toFixed(3)
                        ),
                      })
                    }
                    className={`${HOVER_BG} w-full border rounded px-2 py-1  text-right`}
                  />
                </td>

                {/* Price */}
                <td className={TD_CLASS}>
                  <Input
                    type="number"
                    min={0}
                    step="0.001"
                    value={item.price}
                    onChange={(e) =>
                      updateSalesRow(idx, {
                        price: Number(e.target.value || 0),
                        amount: Number(
                          (Number(e.target.value || 0) * item.qty || 0).toFixed(
                            3
                          )
                        ),
                      })
                    }
                    className={`${HOVER_BG} w-full border rounded px-2 py-1  text-right`}
                  />
                </td>

                {/* Unit */}
                <td className={TD_CLASS}>
                  <SelectBox
                    value={item.unit}
                    onChange={(e) =>
                      updateSalesRow(idx, { unit: e.target.value })
                    }
                    className={`${TD_CLASS} w-full rounded px-2 py-1 `}
                  >
                    {item.unitList?.map((u, i) => (
                      <option key={i} value={u}>
                        {u}
                      </option>
                    ))}
                  </SelectBox>
                </td>

                {/* Amount */}
                <td className={`${TD_CLASS} text-right font-semibold`}>
                  {(item.amount ?? 0).toFixed(3)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        {/* Add Row Button */}
        <tfoot className="text-center border-t border-gray-300">
          <tr>
            <td colSpan={2} className="">
              <AddItemButton
                onClick={() => addNextAvailableProduct(products)}
                className={`
                  flex justify-center flex-nowrap text-nowrap my-3
                  ml-4 cursor-pointer gap-2 bg-blue-50 px-5 py-3 lg:px-3 lg:py-1 2xl:px-5 2xl:py-3 rounded-md 
                  font-semibold text-blue-900 
                `}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
