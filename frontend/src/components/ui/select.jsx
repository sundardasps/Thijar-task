import { forwardRef, useEffect, useRef, useState } from "react";
import { BORDER, INPUT_STYLE } from "../../styles/constents";
import { ChevronDown, PlusCircle } from "lucide-react";
import AddCategory from "../pos/common/modalContents/AddCategory";
import { useQueryClient } from "@tanstack/react-query";

export const SelectBox = forwardRef(
  (
    {
      children,
      className = "",
      placeholder = "",
      ChevronLeftBoarder,
      value,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          {...props}
          className={`
            w-full bg-transparent outline-none appearance-none cursor-pointer
            ${INPUT_STYLE} ${className}
            ${!value ? "text-gray-400" : "text-gray-900"}
          `}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {children}
        </select>

        <div
          className={`absolute inset-y-0 right-0 flex items-center justify-center p-2 pointer-events-none 
            ${ChevronLeftBoarder ? "border-l-2 border-gray-300 my-3" : ""}`}
        >
          <ChevronDown size={18} className="text-gray-400" />
        </div>
      </div>
    );
  }
);

export default function ItemGroupSelect({
  value,
  onChange,
  list = [],
  isLoading,
  isError,
  refetch,
}) {
  const [open, setOpen] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const ref = useRef(null);
  const queryClient = useQueryClient();

  const categories = Array.isArray(list) ? list : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAfterCreate = (createdCategory) => {
    const newValue =
      typeof createdCategory === "object"
        ? createdCategory
        : createdCategory ?? null;

    queryClient.invalidateQueries(["categories"]);
    if (newValue && onChange) onChange(newValue);

    setShowAddCategory(false);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <div
        onClick={() => {
          setOpen((v) => !v);
          if (!open) refetch();
        }}
        className={`${
          open
            ? "outline-none ring-1 ring-blue-900 border-blue-900"
            : "border-gray-300 border"
        } h-[42px] rounded-md px-2 flex items-center justify-between cursor-pointer`}
      >
        <span
          className={`${
            value ? "text-gray-900" : "text-gray-400"
          } w-full border-r-2 border-gray-300`}
        >
          {value || "Select category"}
        </span>

        <ChevronDown size={18} className="text-gray-600 ml-2" />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className={`absolute z-50 bg-white w-full mt-1 rounded-md shadow-md max-h-56 overflow-y-auto scrollbar-hide ${BORDER}`}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 cursor-pointer bg-white hover:bg-gray-100 font-semibold border-gray-300 border-b"
            onClick={() => {
              setOpen(false);
              setShowAddCategory(true);
            }}
          >
            <PlusCircle size={18} /> Add new category
          </div>

          {/* Loading / Error */}
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="px-3 py-2 text-sm text-red-500">Failed to load</div>
          ) : categories.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No categories</div>
          ) : (
            categories.map((item, i) => {
              const label = typeof item === "string" ? item : item.name;
              return (
                <div
                  key={i}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer uppercase  "
                  onClick={() => {
                    onChange && onChange(item);
                    setOpen(false);
                  }}
                >
                  {label}
                </div>
              );
            })
          )}
        </div>
      )}

      <AddCategory
        open={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSave={(created) => handleAfterCreate(created)}
      />
    </div>
  );
}
