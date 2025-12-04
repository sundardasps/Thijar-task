import { X } from "lucide-react";
import AppModal from "../../../ui/modal";

export default function DeleteItem({
  open,
  onClose,
  itemName = "",
  onConfirm,
}) {
  return (
    <AppModal open={open} onClose={onClose} width="w-xl">
      <div className="px-8 py-6 space-y-5">
        {/* TITLE + Close Icon */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Delete Item ?</h2>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-600 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">"{itemName}"</span>?{" "}
          <br />
          This action cannot be undone.
        </p>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </AppModal>
  );
}
