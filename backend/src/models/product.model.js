import mongoose from "mongoose";
import {
  discountTypeOptions,
  goodsOrServices,
  taxModeTypes,
} from "../utils/constants.js";

const productSchema = new mongoose.Schema(
  {
    itemGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: { type: String, required: true, trim: true },
    hsn: { type: String, trim: true },
    itemCode: { type: String, trim: true },

    barcode: { type: String, unique: true, sparse: true },

    goodsOrServices: {
      type: String,
      enum: goodsOrServices,
      default: goodsOrServices[0],
    },

    // Units
    unitPrimary: { type: String, required: true },
    unitSecondary: { type: String },
    conversionFactor: { type: Number, default: 1 },

    // Tax Includes
    purchaseTaxMode: {
      type: String,
      enum: taxModeTypes,
      default: taxModeTypes[0],
    },
    retailTaxMode: {
      type: String,
      enum: taxModeTypes,
      default: taxModeTypes[0],
    },
    wholesaleTaxMode: {
      type: String,
      enum: taxModeTypes,
      default: taxModeTypes[0],
    },

    // Tax
    tax: { type: Number, required: true, min: 0 },

    // Batch / Serial
    hasBatch: { type: Boolean, default: false },
    hasSerial: { type: Boolean, default: false },

    // Pricing
    purchaseRate: { type: Number, default: 0 },
    retailRate: { type: Number, default: 0 },
    wholesaleRate: { type: Number, default: 0 },

    // Discount
    discountAmount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: discountTypeOptions,
      default: discountTypeOptions[0],
    },

    // Warehouse
    warehouse: { type: String, required: true },

    // Stock
    openingStockEnabled: { type: Boolean, default: false },
    stockQty: { type: Number, min: 0, default: 0 },

    // Image
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
