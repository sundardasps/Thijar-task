import { Upload, X } from "lucide-react";
import AppModal from "../../../ui/modal";
import { Input } from "../../../ui/input";
import ItemGroupSelect, { SelectBox } from "../../../ui/select";
import { CHECKBOX_CLASS, ROUNDED } from "../../../../styles/constents";
import { Formik } from "formik";
import {
  discountTypeOptions,
  goodsOrServices,
  taxModeTypes,
  taxTypeOptions,
  unitOptions,
  warehouseOptions,
} from "../../../../utils/constants";
import {
  addItemInitialValues,
  addItemvalidationSchema,
} from "../../../../validations/auth.validation";
import { useMutation } from "@tanstack/react-query";
import {
  addProductAPI,
  updateProductAPI,
} from "../../../../api/modules/product.api";
import { useEffect, useState } from "react";


import {
  deleteImageAPI,
  uploadImageAPI,
} from "../../../../api/modules/cloudinary.api";
import { useCategories } from "../../../../hooks/useCategories";

const Label = ({ className = "", children }) => (
  <p className={`text-sm font-semibold text-gray-700 ${className}`}>
    {children}
  </p>
);

export default function AddItemModal({ open, onClose, onSave, editData }) {
  const [submitMode, setSubmitMode] = useState("save");
  const [image, setImage] = useState(""); // preview URL (edit or new)
  const [imageFile, setImageFile] = useState(null); // actual new file
  const [removedOldImage, setRemovedOldImage] = useState(false); // delete flag

  const [submitLoading, setSubmitLoading] = useState(false);

  const addProduct = useMutation({
    mutationFn: addProductAPI,
  });

  const updateProduct = useMutation({
    mutationFn: updateProductAPI,
  });

  const { data: categoryList, isError, isLoading, refetch } = useCategories();

  const isEdit = !!editData;

  const mappedEditValues = isEdit
    ? {
        name: editData.name || "",
        hsn: editData.hsn || "",
        itemCode: editData.itemCode || "",
        barcode: editData.barcode || "",
        unitPrimary: editData.unitPrimary || "",
        unitSecondary: editData.unitSecondary || "",
        conversionFactor: editData.conversionFactor || "",
        tax: editData.tax || "",
        hasBatch: editData.hasBatch || false,
        hasSerial: editData.hasSerial || false,
        purchaseRate: editData.purchaseRate || "",
        retailRate: editData.retailRate || "",
        wholesaleRate: editData.wholesaleRate || "",
        discountAmount: editData.discountAmount || 0,
        discountType: editData.discountType || "",
        warehouse: editData.warehouse || "",
        ddOption: editData.ddOption || "",
        itemGroup: {
          id:
            categoryList?.items?.find(
              (value) => value._id === editData?.itemGroup
            )._id || "",
          name:
            categoryList?.items?.find(
              (value) => value._id === editData?.itemGroup
            ).name || "",
        },
        openingStockEnabled: editData.openingStockEnabled || false,
        stockQty: editData.stockQty || 0,
        purchaseTaxMode: editData.purchaseTaxMode || taxModeTypes[0],
        retailTaxMode: editData.retailTaxMode || taxModeTypes[0],
        wholesaleTaxMode: editData.wholesaleTaxMode || taxModeTypes[0],
        goodsOrServices: editData.goodsOrServices || goodsOrServices[0],
        image: editData.image || null,
      }
    : addItemInitialValues;

  const isBackendError = addProduct.isError || updateProduct.isError;
  const backendError =
    addProduct.error?.response?.data?.message ||
    updateProduct.error?.response?.data?.message;

  useEffect(() => {
    if (isEdit && editData?.image?.url) {
      setImage(editData.image.url);
      setImageFile(null);
      setRemovedOldImage(false);
    }
  }, [isEdit, editData]);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file)); 
    setImageFile(file);

    if (isEdit && editData?.image) {
      setRemovedOldImage(true);
      setFieldValue("image", "");
    }
  };

  const handleRemoveImage = (setFieldValue) => {
    if (isEdit && editData?.image) {
      setRemovedOldImage(true);
    }

    setImage("");
    setImageFile(null);
    setFieldValue("image", "");
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      width="md:max-w-6xl"
      Header={Header}
    >
      <Formik
        key={editData?._id || "new"}
        enableReinitialize
        initialValues={mappedEditValues}
        validationSchema={addItemvalidationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          addProduct.reset();
          updateProduct.reset();
          setSubmitLoading(true);

          try {
            /***********************
             * 1) UPLOAD NEW IMAGE
             ***********************/
            let finalImage = null;

            let imageObject = null;

            if (imageFile) {
              const formData = new FormData();
              formData.append("image", imageFile);

              try {
                const res = await uploadImageAPI(formData);
                imageObject = res?.data?.data; // must return { url, publicId }
              } catch (err) {
                console.error("Image upload failed:", err);
              }
            }

            /***********************
             * 2) DELETE OLD IMAGE (if removed)
             ***********************/
            if (isEdit && removedOldImage && editData?.image?.publicId) {
              try {
                await deleteImageAPI(editData.image.publicId);
              } catch (err) {
                console.error("Failed to delete old image:", err);
              }
            }

            /***********************
             * 3) USE EXISTING IMAGE (if no replace)
             ***********************/
            if (!imageFile && isEdit && !removedOldImage) {
              finalImage = editData.image || null;
            }

            /***********************
             * 4) CREATE PAYLOAD
             ***********************/
            const payload = {
              ...values,
              itemGroup: values.itemGroup.id,
              image: imageObject, // either object or null
            };

            /***********************
             * 5) SUBMIT
             ***********************/
            if (isEdit) {
              updateProduct.mutate(
                { id: editData._id, data: payload },
                {
                  onSuccess: () => {
                    onSave?.();
                    resetForm();
                    onClose();
                    setSubmitting(false);
                    setSubmitLoading(false);
                  },
                  onError: () => {
                    setSubmitting(false);
                    setSubmitLoading(false);
                  },
                }
              );
            } else {
              addProduct.mutate(payload, {
                onSuccess: () => {
                  if (submitMode === "new") {
                    resetForm();
                    setImage(null);
                    setImageFile(null);
                    setSubmitting(false);
                    setSubmitLoading(false);
                    return;
                  }

                  onSave?.();
                  resetForm();
                  setImage(null);
                  setImageFile(null);
                  onClose();
                  setSubmitting(false);
                  setSubmitLoading(false);
                },
                onError: () => {
                  setSubmitting(false);
                  setSubmitLoading(false);
                },
              });
            }
          } catch (err) {
            console.error("Submission failed:", err);
            setSubmitting(false);
            setSubmitLoading(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit} className=" py-2 space-y-2">
            {/* TITLE ROW */}
            <div className="md:flex mx-8 space-y-3 pb-3 md:pb-0 justify-between items-center border-b text-gray-300 ">
              <h2 className="text-xl font-semibold text-blue-900 w-fit border-b-2  pb-3">
                New Material
              </h2>

              <div className="flex items-start text-gray-500 gap-2 w-full md:w-1/2 md:justify-end">
                <span>Goods/Services</span>
                <SelectBox
                  name="goodsOrServices"
                  className="rounded pr-16 text-sm w-full md:w-40"
                  value={values.goodsOrServices}
                  onChange={(e) =>
                    setFieldValue("goodsOrServices", e.target.value)
                  }
                >
                  {goodsOrServices.map((u, i) => (
                    <option key={i} value={u}>
                      {u}
                    </option>
                  ))}
                </SelectBox>
              </div>
            </div>

            {/* BODY GRID */}
            <div className="grid grid-cols-1 px-8 md:grid-cols-2 gap-y-6 md:gap-y-0 md:gap-x-6">
              {/* LEFT SIDE */}
              <div className="space-y-3">
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <Label>Item group selection</Label>
                  <ItemGroupSelect
                    isError={isError}
                    isLoading={isLoading}
                    refetch={refetch}
                    list={categoryList?.items}
                    value={values.itemGroup.name}
                    onChange={(value) =>
                      setFieldValue("itemGroup", {
                        name: value.name,
                        id: value._id,
                      })
                    }
                  />
                  {errors.itemGroup?.id && touched.itemGroup?.id && (
                    <p className="text-red-500 text-xs">
                      {errors.itemGroup.id}
                    </p>
                  )}
                </div>

                {/* Input Fields */}
                <div className="md:flex gap-3 ">
                  <div className="flex flex-col md:w-1/2 justify-center gap-2">
                    <Label>Item Name*</Label>
                    <Input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter item name"
                      className="w-full h-[42px]"
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-xs">{errors.name}</p>
                    )}
                  </div>

                  <div className="flex flex-col md:w-1/2 justify-center gap-2">
                    <Label>Item HSN</Label>
                    <Input
                      name="hsn"
                      value={values.hsn}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter item hsn"
                      className="w-full h-[42px]"
                    />
                    {errors.hsn && touched.hsn && (
                      <p className="text-red-500 text-xs">{errors.hsn}</p>
                    )}
                  </div>
                </div>

                <div className="md:flex gap-3">
                  <div className="flex flex-col md:w-1/2 justify-center gap-2">
                    <Label>Item Code</Label>
                    <Input
                      name="itemCode"
                      value={values.itemCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter item code"
                      className="w-full h-[42px]"
                    />
                    {errors.itemCode && touched.itemCode && (
                      <p className="text-red-500 text-xs">{errors.itemCode}</p>
                    )}
                  </div>

                  <div className="flex flex-col md:w-1/2 justify-center gap-2">
                    <Label>Barcode</Label>
                    <Input
                      name="barcode"
                      value={values.barcode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Barcode"
                      className="w-full h-[42px]"
                    />
                    {errors.barcode && touched.barcode && (
                      <p className="text-red-500 text-xs">{errors.barcode}</p>
                    )}
                  </div>
                </div>

                {/* Units Row */}
                <div className="grid xl:grid-cols-3 gap-3">
                  <div className="flex flex-col justify-center gap-2">
                    <Label>Unit Primary</Label>
                    <SelectBox
                      className="pr-7"
                      name="unitPrimary"
                      value={values.unitPrimary}
                      onChange={(e) =>
                        setFieldValue("unitPrimary", e.target.value)
                      }
                      onBlur={handleBlur}
                      placeholder="Select unit"
                    >
                      {unitOptions.map((u, i) => (
                        <option key={i} value={u}>
                          {u}
                        </option>
                      ))}
                    </SelectBox>
                    {errors.unitPrimary && touched.unitPrimary && (
                      <p className="text-red-500 text-xs">
                        {errors.unitPrimary}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-center gap-2">
                    <Label>Secondary</Label>
                    <SelectBox
                      className="pr-7"
                      name="unitSecondary"
                      value={values.unitSecondary}
                      onChange={(e) =>
                        setFieldValue("unitSecondary", e.target.value)
                      }
                      onBlur={handleBlur}
                      placeholder="Select unit"
                    >
                      {unitOptions.map((u, i) => (
                        <option key={i} value={u}>
                          {u}
                        </option>
                      ))}
                    </SelectBox>
                    {errors.unitSecondary && touched.unitSecondary && (
                      <p className="text-red-500 text-xs">
                        {errors.unitSecondary}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-center gap-2">
                    <Label>CF*</Label>
                    <Input
                      name="conversionFactor"
                      value={values.conversionFactor}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="CF"
                      className="w-full h-[42px]"
                    />
                    {errors.conversionFactor && touched.conversionFactor && (
                      <p className="text-red-500 text-xs">
                        {errors.conversionFactor}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tax + Batch */}
                <div className="grid xl:grid-cols-3 gap-3">
                  <div className="flex flex-col justify-center gap-2">
                    <Label>Tax%</Label>
                    <SelectBox
                      className="pr-7"
                      name="tax"
                      value={values.tax}
                      onChange={(e) => {
                        setFieldValue("tax", Number(e.target.value));
                      }}
                      onBlur={handleBlur}
                      placeholder="Select tax"
                    >
                      {taxTypeOptions.map((u, i) => (
                        <option key={i} value={u}>
                          {`Vat${u}%`}
                        </option>
                      ))}
                    </SelectBox>
                    {errors.tax && touched.tax && (
                      <p className="text-red-500 text-xs">{errors.tax}</p>
                    )}
                  </div>

                  <div>
                    <FieldCheckWithFormik
                      label="Batch"
                      name="hasBatch"
                      value={values.hasBatch}
                      setFieldValue={setFieldValue}
                    />
                  </div>

                  <div>
                    <FieldCheckWithFormik
                      label="Serial Number"
                      name="hasSerial"
                      value={values.hasSerial}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Item image</Label>

                  <div
                    className="border-2 border-dashed border-gray-400 rounded-lg h-28 flex flex-col items-center justify-center text-gray-500 cursor-pointer"
                    onClick={() =>
                      document.getElementById("itemImageInput").click()
                    }
                  >
                    <Upload size={32} />
                    <p className="font-medium mt-1">Upload image (max 5MB)</p>
                    <small>PNG, JPG supported</small>
                  </div>

                  <input
                    id="itemImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                  />
                </div>
                {image && (
                  <div className="relative w-max">
                    <img
                      src={image}
                      className={`h-20 w-20 object-cover ${ROUNDED} shadow`}
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(setFieldValue)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col space-y-3">
                {/* Purchase Rate */}
                <div className="flex flex-col gap-3">
                  {/* Radio group + label kept in same layout */}
                  <div className="flex flex-row justify-between gap-2">
                    <Label>Purchase Rate</Label>
                    <div className="flex flex-col xl:flex-row items-center gap-6 text-sm font-semibold text-gray-700">
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          name="purchaseTaxMode"
                          value="include"
                          checked={values.purchaseTaxMode === "include"}
                          onChange={(e) =>
                            setFieldValue("purchaseTaxMode", e.target.value)
                          }
                          className="w-4 h-4 accent-blue-500"
                        />
                        Include Tax
                      </label>

                      <label className="flex gap-2">
                        <input
                          type="radio"
                          name="purchaseTaxMode"
                          value="exclude"
                          checked={values.purchaseTaxMode === "exclude"}
                          onChange={(e) =>
                            setFieldValue("purchaseTaxMode", e.target.value)
                          }
                          className="w-4 h-4 accent-blue-500"
                        />
                        Exclude Tax
                      </label>
                    </div>
                  </div>

                  <Input
                    name="purchaseRate"
                    value={values.purchaseRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-[42px]"
                  />
                  {errors.purchaseRate && touched.purchaseRate && (
                    <p className="text-red-500 text-xs">
                      {errors.purchaseRate}
                    </p>
                  )}
                </div>

                {/* Retail Rate */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between gap-2">
                    <Label>Retail Rate</Label>
                    <div className="flex flex-col xl:flex-row items-center gap-6 text-sm font-semibold text-gray-700">
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          name="retailTaxMode"
                          value="include"
                          checked={values.retailTaxMode === "include"}
                          onChange={(e) =>
                            setFieldValue("retailTaxMode", e.target.value)
                          }
                          className="w-4 h-4 accent-blue-500"
                        />
                        Include Tax
                      </label>

                      <label className="flex gap-2">
                        <input
                          type="radio"
                          name="retailTaxMode"
                          value="exclude"
                          checked={values.retailTaxMode === "exclude"}
                          onChange={(e) =>
                            setFieldValue("retailTaxMode", e.target.value)
                          }
                          className="w-4 h-4 accent-blue-500"
                        />
                        Exclude Tax
                      </label>
                    </div>
                  </div>

                  <Input
                    name="retailRate"
                    value={values.retailRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-[42px]"
                  />
                  {errors.retailRate && touched.retailRate && (
                    <p className="text-red-500 text-xs">{errors.retailRate}</p>
                  )}
                </div>

                {/* Wholesale Rate */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between gap-2">
                    <Label>Wholesale Rate</Label>
                    <div className="flex flex-col xl:flex-row items-center gap-6 text-sm font-semibold text-gray-700">
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          name="wholesaleTaxMode"
                          value="include"
                          checked={values.wholesaleTaxMode === "include"}
                          onChange={(e) =>
                            setFieldValue("wholesaleTaxMode", e.target.value)
                          }
                          className="w-4 h-4 accent-blue-500"
                        />
                        Include Tax
                      </label>

                      <label className="flex gap-2">
                        <input
                          type="radio"
                          name="wholesaleTaxMode"
                          value="exclude"
                          checked={values.wholesaleTaxMode === "exclude"}
                          onChange={(e) =>
                            setFieldValue("wholesaleTaxMode", e.target.value)
                          }
                          className="w-4 h-4 accent-blue-500"
                        />
                        Exclude Tax
                      </label>
                    </div>
                  </div>

                  <Input
                    name="wholesaleRate"
                    value={values.wholesaleRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-[42px]"
                  />
                  {errors.wholesaleRate && touched.wholesaleRate && (
                    <p className="text-red-500 text-xs">
                      {errors.wholesaleRate}
                    </p>
                  )}
                </div>

                {/* Discount + Warehouse */}
                <div className="flex flex-col xl:flex-row gap-3">
                  <div className="flex flex-col xl:w-1/2 gap-2">
                    <Label>Discount Amount</Label>
                    <div className="flex">
                      <Input
                        name="discountAmount"
                        value={values.discountAmount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="rounded-r-none w-20"
                        placeholder="Discount amount"
                      />
                      <SelectBox
                        className="rounded-l-none flex-1 mr-24"
                        name="discountType"
                        value={values.discountType}
                        onChange={(e) =>
                          setFieldValue("discountType", e.target.value)
                        }
                        placeholder="Type"
                      >
                        {discountTypeOptions.map((u, i) => (
                          <option key={i} value={u}>
                            {u}
                          </option>
                        ))}
                      </SelectBox>
                    </div>
                    <div className="flex justify-between">
                      {errors.discountAmount && touched.discountAmount && (
                        <p className="text-red-500 text-xs">
                          {errors.discountAmount}
                        </p>
                      )}
                      {errors.discountType && touched.discountType && (
                        <p className="text-red-500 text-xs">
                          {errors.discountType}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="xl:w-1/2">
                    <div className={`flex flex-col justify-center gap-2`}>
                      <Label>Warehouse</Label>
                      <SelectBox
                        className=""
                        name="warehouse"
                        value={values.warehouse}
                        onChange={(e) =>
                          setFieldValue("warehouse", e.target.value)
                        }
                        placeholder="Select warehouse"
                      >
                        {warehouseOptions.map((u, i) => (
                          <option key={i} value={u}>
                            {u}
                          </option>
                        ))}
                      </SelectBox>
                    </div>
                    {errors.warehouse && touched.warehouse && (
                      <p className="text-red-500 text-xs">{errors.warehouse}</p>
                    )}
                  </div>
                </div>

                <div className="flex w-min items-center gap-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className={CHECKBOX_CLASS}
                    checked={values.openingStockEnabled}
                    onChange={(e) =>
                      setFieldValue("openingStockEnabled", e.target.checked)
                    }
                  />
                  <h6 className="text-base">Enabled Opening Stock</h6>
                </div>

                {values.openingStockEnabled && (
                  <div className="flex flex-col gap-2">
                    <Label>Opening Stock Qty</Label>
                    <Input
                      name="stockQty"
                      value={values.stockQty}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="h-[42px] w-36"
                      placeholder="0"
                    />
                    {errors.stockQty && touched.stockQty && (
                      <p className="text-red-500 text-xs">{errors.stockQty}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            {isBackendError && (
              <p className="text-red-600 text-sm mt-2 text-center">
                {backendError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-3  mt-3 px-3 border-t border-gray-300">
              {isEdit ? (
                <BtnBlue
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setSubmitMode("save");
                    handleSubmit();
                  }}
                >
                  {submitLoading ? "Updating..." : "Update"}
                </BtnBlue>
              ) : (
                <>
                  <BtnRed
                    type="button"
                    onClick={() => {
                      resetForm();
                    }}
                  >
                    Clear all
                  </BtnRed>

                  <BtnOutline
                    type="button"
                    onClick={() => {
                      setSubmitMode("new");
                      handleSubmit();
                    }}
                  >
                    {submitLoading && submitMode === "new"
                      ? "Saving..."
                      : "Save & New"}
                  </BtnOutline>

                  <BtnBlue
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setSubmitMode("save");
                      handleSubmit();
                    }}
                  >
                    {submitLoading && submitMode === "save"
                      ? "Saving..."
                      : "Save"}
                  </BtnBlue>
                </>
              )}
            </div>
          </form>
        )}
      </Formik>
    </AppModal>
  );
}

/* Header */
const Header = ({ onClose }) => (
  <div className="flex justify-end bg-blue-900 p-3 rounded-t-md">
    <button onClick={onClose}>
      <X className="w-5 h-5 text-white" />
    </button>
  </div>
);

/* FieldCheck wired to Formik (keeps layout) */
function FieldCheckWithFormik({ label, name, value, setFieldValue }) {
  return (
    <div className="grid items-start gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className={CHECKBOX_CLASS}
          checked={value}
          onChange={(e) => setFieldValue(name, e.target.checked)}
        />
        <h6 className="text-base">Enabled</h6>
      </div>
    </div>
  );
}

/* Footer buttons (keeps your original classes) */
const Btn = ({ className = "", children, ...rest }) => (
  <button
    className={`px-8 py-1 rounded-md h-min font-semibold ${className}`}
    {...rest}
  >
    {children}
  </button>
);
const BtnRed = ({ children, ...rest }) => (
  <Btn className="bg-red-500 text-white hover:bg-red-600" {...rest}>
    {children}
  </Btn>
);
const BtnBlue = ({ children, ...rest }) => (
  <Btn className="bg-blue-900 text-white hover:bg-blue-800" {...rest}>
    {children}
  </Btn>
);
const BtnOutline = ({ children, ...rest }) => (
  <Btn
    className="border border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white"
    {...rest}
  >
    {children}
  </Btn>
);
