import React, { useState } from "react";
import {
  Plus,
  Minus,
  Printer,
  DollarSign,
  PauseCircle,
  Undo2,
  Trash,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  Eraser,
} from "lucide-react";
import { ControlButton } from "../../ui/button";
import MaterialList from "./modalContents/MaterialList";
import { useSales } from "../../../context/SalesContext";

function Controlles() {
  const [showMaterial, setShowMaterial] = useState(false);
  const { deleteSelectedRow, deleteAll, increaseQty, decreaseQty } = useSales();
  return (
    <div
      className={`flex md:flex-row flex-col  gap-3 border-t-2 border-l-2 border-gray-300 h-full w-full p-3`}
    >
      <div className="grid grid-cols-4 gap-3  md:w-1/2">
        {/* Row 1 */}
        <ControlButton
          label="Hold"
          icon={<PauseCircle size={18} />}
          type="yellow"
        />
        <ControlButton
          label="Recall"
          icon={<Undo2 size={18} />}
          type="yellow"
        />
        <ControlButton
          onClick={increaseQty}
          label="QTY"
          icon={<Plus size={18} />}
          type="yellow"
        />
        <ControlButton
          onClick={deleteAll}
          label="Del All"
          icon={<Trash size={18} />}
          type="red"
        />

        {/* Row 2 */}
        <ControlButton
          label="Prev"
          icon={<ChevronLeft size={18} />}
          type="yellow"
        />
        <ControlButton
          label="Next"
          icon={<ChevronRight size={18} />}
          type="yellow"
        />
        <ControlButton
          onClick={decreaseQty}
          label="QTY"
          icon={<Minus size={18} />}
          type="yellow"
        />
        <ControlButton
          onClick={deleteSelectedRow}
          label="Del Row"
          icon={<Trash size={18} />}
          type="red"
        />

        {/* Row 3 */}
        <ControlButton
          label="Reprint"
          icon={<Printer size={18} />}
          type="blue"
        />
        <ControlButton
          icon={<CornerDownLeft size={18} />}
          label="S Return"
          type="blue"
        />
        <ControlButton icon={<Eraser size={18} />} label="Clear" type="blue" />
        <ControlButton
          label="Price"
          icon={<DollarSign size={18} />}
          type="blue"
        />
      </div>
      <div className="grid  gap-3   md:w-1/2">
        {/* Column 1 - 2 buttons */}
        <div className="grid grid-cols-2  gap-3">
          <ControlButton
            label="PREVIEW & SAVE"
            type="green"
            className="uppercase"
          />
          <ControlButton
            label="SAVE & PRINT"
            type="green"
            className="uppercase"
          />
        </div>

        {/* Column 2 - 3 buttons */}
        <div className="grid grid-cols-3 gap-3">
          <ControlButton label="Report" type="yellow" />
          <ControlButton label="Cash" type="yellow" />
          <ControlButton label="0.00" type="yellow" />
        </div>

        {/* Column 3 - 3 buttons */}
        <div className="grid grid-cols-3 gap-3">
          <ControlButton label="Accounts" type="blue" />
          <ControlButton
            onClick={() => setShowMaterial(true)}
            label="Item"
            type="blue"
          />
          <ControlButton label="Balance 0.000" type="blue" />
        </div>
      </div>
      <MaterialList
        setShowMaterial={setShowMaterial}
        showMaterial={showMaterial}
      />
    </div>
  );
}

export default Controlles;
