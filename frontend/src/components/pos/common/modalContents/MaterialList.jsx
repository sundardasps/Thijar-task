import {
  ArrowUpDown,
  ChevronsLeft,
  ChevronsRight,
  EllipsisVertical,
  SearchIcon,
  X,
} from "lucide-react";
import AppModal from "../../../ui/modal";
import { AddItemButton } from "../../Sales/Table";
import { Input } from "../../../ui/input";
import { useEffect, useState } from "react";
import AddItemModal from "./AddItem";
import DeleteItem from "./DeleteItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProductAPI,
  getProductsAPI,
} from "../../../../api/modules/product.api";
import { BORDER, ROUNDED } from "../../../../styles/constents";

/* ---------- HEADER Component ---------- */
const Header = ({ onClose }) => (
  <div className="flex justify-end items-center border-b bg-blue-900 p-3 rounded-t-md">
    <button onClick={onClose}>
      <X className="w-5 h-5 text-white hover:text-gray-200" />
    </button>
  </div>
);

/* ---------- FOOTER Component ---------- */
const Footer = ({
  page,
  total,
  showingStart,
  showingEnd,
  totalPages,
  hasNextPage,
  handlePrev,
  handleNext,
}) => (
  <div
    className={`md:flex justify-between items-center  text-xs md:text-base pb-4 space-y-3 md:space-y-0`}
  >
    <p className="text-gray-600">
      Showing {showingStart}–{showingEnd} of {total} records
    </p>

    <div className="flex items-center text-gray-600 gap-2">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="border border-gray-200 rounded-md p-2 disabled:opacity-40"
      >
        <ChevronsLeft size={18} />
      </button>

      <span>Page</span>

      <button className="border border-gray-300 shadow px-8 py-2 rounded-md">
        {page}
      </button>

      <span>of {totalPages}</span>

      <button
        onClick={handleNext}
        disabled={!hasNextPage}
        className="border border-gray-300 rounded-md p-2 disabled:opacity-40"
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  </div>
);

/* ---------- TABLE CELL COMPONENTS ---------- */
// TableHeadCell (updated)
const TableHeadCell = ({
  label,
  showArrow = true,
  center = false,
  className = "",
}) => (
  <th
    className={`border-2 border-gray-400/50 p-2 bg-gray-200 font-medium ${className}`}
  >
    <div
      className={`flex items-center gap-2 ${center ? "justify-center" : ""}`}
    >
      {label} {showArrow && <ArrowUpDown size={14} />}
    </div>
  </th>
);

const TableCell = ({ children, center, className, ...props }) => (
  <td
    {...props}
    className={`border-2 border-gray-400/50 px-3 text-base ${
      center ? "text-center" : ""
    } ${className}`}
  >
    {children}
  </td>
);

/* ------------------------------------------------- */

export default function MaterialList({ showMaterial, setShowMaterial }) {
  const queryClient = useQueryClient();

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null); // store row ID

  const [page, setPage] = useState(1);
  const limit = 8;

  /* ---------------- SEARCH with Debounce ---------------- */
  const [rawSearch, setRawSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValue(rawSearch);
      setPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [rawSearch]);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["products", page, searchValue],
    queryFn: () => getProductsAPI({ page, search: searchValue, limit }),
    keepPreviousData: true,
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: true,
  });

  const total = apiData?.data?.data?.total ?? 0;
  const totalPages = apiData?.data?.data?.totalPages ?? 1;
  const products = apiData?.data?.data?.items ?? [];

  const showingStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingEnd = Math.min(page * limit, total);

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  /* ---------------- AFTER CREATE ITEM ---------------- */
  const handleAfterCreate = () => {
    queryClient.invalidateQueries(["products", "products-infinite"]);
  };

  return (
    <AppModal
      open={showMaterial}
      width="lg:max-w-4xl"
      onClose={() => setShowMaterial(false)}
      Header={Header}
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="px-8 py-2 space-y-5">
        {/* Title */}
        <h2 className="text-xl font-semibold text-blue-900 w-fit border-b-2 pb-1">
          Material List
        </h2>

        {/* Search + Add Button */}
        <div className="md:flex justify-between items-center border-t border-gray-300 pt-3 space-y-3 md:space-y-0">
          <div className="relative text-gray-400">
            <SearchIcon className="absolute left-3 top-3  w-5 h-5" />
            <Input
              placeholder="Search by item name...."
              className="pl-10 md:w-md font-medium"
              value={rawSearch}
              onChange={(e) => setRawSearch(e.target.value)}
            />
          </div>

          <AddItemButton
            text="Add Item"
            onClick={() => {
              setSelectedProduct(null);
              setShowAddItemModal(true);
            }}
            className="flex gap-2 items-center bg-blue-900 px-5 py-2 text-white rounded hover:bg-blue-800 ml-auto md:m-0"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-scroll md:overflow-x-hidden">
          <table className="w-full border-2 border-gray-300 rounded ">
            <thead>
              <tr className="text-gray-600 text-sm">
                <TableHeadCell className="w-44" center label="TYPE" />
                <TableHeadCell className="w-96" label="ITEM NAME" />
                <TableHeadCell className="w-44" label="PRICE" />
                <TableHeadCell className="w-10" showArrow={false} />
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                // ---------- SKELETON LOADER ----------
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <TableCell center className="py-1">
                      <div className="h-5 w-full bg-blue-100 rounded-md"></div>
                    </TableCell>

                    <TableCell className="py-1 ">
                      <div className="h-5 w-full bg-blue-100 rounded-md"></div>
                    </TableCell>

                    <TableCell className="py-1 ">
                      <div className="h-5 w-full bg-blue-100 rounded-md"></div>
                    </TableCell>

                    <TableCell center className="py-1 ">
                      <div className="h-10 w-10 mx-auto bg-blue-100 rounded-full"></div>
                    </TableCell>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 h-52 text-center text-gray-500"
                  >
                    No items found
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 even:bg-gray-100"
                  >
                    <TableCell className="font-semibold uppercase" center>
                      G
                    </TableCell>
                    <TableCell className="uppercase ">{item.name}</TableCell>
                    <TableCell>{item.purchaseRate}</TableCell>
                    <TableCell center className="relative">
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === item._id ? null : item._id
                          )
                        }
                        className="cursor-pointer py-2 px-3"
                      >
                        <EllipsisVertical />
                      </button>

                      {dropdownOpen === item._id && (
                        <div
                          className={`absolute right-0 top-8 bg-white  shadow-md rounded-md w-32 z-50 ${BORDER} ${ROUNDED}`}
                        >
                          <button
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowAddItemModal(true);
                              setDropdownOpen(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowDelete(true);
                              setDropdownOpen(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION */}

        <Footer
          page={page}
          total={total}
          showingStart={showingStart}
          showingEnd={showingEnd}
          totalPages={totalPages}
          hasNextPage={page < totalPages}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      </div>

      <AddItemModal
        key={selectedProduct ? selectedProduct._id : "new"}
        open={showAddItemModal}
        onClose={() => {
          setShowAddItemModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleAfterCreate}
        editData={selectedProduct}
      />

      <DeleteItem
        open={showDelete}
        itemName={selectedProduct?.name}
        onClose={() => setShowDelete(false)}
        onConfirm={async () => {
          await deleteProductAPI(selectedProduct._id);
          setShowDelete(false);
          handleAfterCreate();
        }}
      />
    </AppModal>
  );
}
