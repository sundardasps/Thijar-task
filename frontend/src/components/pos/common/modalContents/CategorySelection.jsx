import React from "react";
import AppModal from "../../../ui/modal";
import { PlusIcon } from "lucide-react";

function CategorySelection() {
  const [showCategory, setShowCategory] = React.useState(false);
  return (
    <AppModal
      open={showCategory}
      title="New Material"
      width="max-w-5xl"
      onClose={() => setShowCategory(false)}
    >
      <label className="text-sm font-medium">Item group selection</label>

      <select className="w-full border p-3 rounded-md mt-1">
        <option>Select category</option>
        <option>Oil</option>
        <option>Choclates</option>
        <option>Spices</option>
      </select>

      <button className="text-blue-600 mt-2 flex items-center gap-1">
        <PlusIcon/> Add new category
      </button>
    </AppModal>
  );
}

export default CategorySelection;
