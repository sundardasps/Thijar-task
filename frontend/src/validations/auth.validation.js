import * as Yup from "yup";
import {
  discountTypeOptions,
  goodsOrServices,
  taxModeTypes,
  warehouseOptions,
} from "../utils/constants";

export const loginSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Email or phone is required")
    .test(
      "email-or-phone",
      "Enter a valid email or phone number",
      (value) =>
        /^\d{10}$/.test(value) || // 10-digit phone
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) // email
    ),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const addItemvalidationSchema = Yup.object().shape({
  itemGroup: Yup.object({
    id: Yup.string().required("Item group is required"),
    name: Yup.string(),
  }),

  name: Yup.string()
    .min(2, "Too short")
    .max(100)
    .required("Item name is required"),
  hsn: Yup.string().nullable(),
  itemCode: Yup.string().nullable(),
  barcode: Yup.string().nullable().required("Barcode is required"),
  unitPrimary: Yup.string().required("Primary unit is required"),
  unitSecondary: Yup.string().nullable(),
  conversionFactor: Yup.number()
    .typeError("CF must be a number")
    .min(1, "CF must be at least 1")
    .required("CF is required"),
  tax: Yup.number()
    .typeError("Tax must be a number")
    .min(0, "Tax cannot be negative")
    .required("Tax is required"),
  hasBatch: Yup.boolean(),
  hasSerial: Yup.boolean(),
  purchaseRate: Yup.number()
    .typeError("Purchase rate must be a number")
    .min(0, "Must be >= 0")
    .required("Purchase rate is required"),
  retailRate: Yup.number()
    .typeError("Retail rate must be a number")
    .min(0, "Must be >= 0")
    .required("Retail rate is required"),
  wholesaleRate: Yup.number()
    .typeError("Wholesale rate must be a number")
    .min(0, "Must be >= 0")
    .required("Wholesale rate is required"),
  purchaseTaxMode: Yup.string().oneOf(taxModeTypes).required(),
  retailTaxMode: Yup.string().oneOf(taxModeTypes).required(),
  wholesaleTaxMode: Yup.string().oneOf(taxModeTypes).required(),
  discountAmount: Yup.number().min(0, "Must be >= 0").nullable(),
  discountType: Yup.string().oneOf(discountTypeOptions).nullable(),
  warehouse: Yup.string()
    .oneOf(warehouseOptions, "Select valid warehouse")
    .required("Warehouse is required"),
  openingStockEnabled: Yup.boolean(),
  stockQty: Yup.number().integer().min(0, "Must be >= 0").nullable(),
  image: Yup.string().nullable(),
  isActive: Yup.boolean(),
  goodsOrServices: Yup.string().oneOf(goodsOrServices).required(),
});

export const addItemInitialValues = {
  itemGroup: { name: "", id: "" },
  name: "",
  hsn: "",
  itemCode: "",
  barcode: "",
  unitPrimary: "",
  unitSecondary: "",
  conversionFactor: 1,
  tax: "",
  hasBatch: false,
  hasSerial: false,
  purchaseRate: "",
  retailRate: "",
  wholesaleRate: "",
  purchaseTaxMode: taxModeTypes[0],
  retailTaxMode: taxModeTypes[0],
  wholesaleTaxMode: taxModeTypes[0],
  discountAmount: 0,
  discountType: "",
  warehouse: "",
  openingStockEnabled: false,
  stockQty: 0,
  image: null,

  isActive: true,
  goodsOrServices: goodsOrServices[0],
};
