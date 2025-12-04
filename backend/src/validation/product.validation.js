import Joi from "joi";
import {
  discountTypeOptions,
  goodsOrServices,
  taxModeTypes,
  warehouseOptions,
} from "../utils/constants.js";

const createProductSchema = Joi.object({
  body: Joi.object({
    itemGroup: Joi.string().hex().length(24).required(),

    name: Joi.string().min(2).max(100).required(),
    hsn: Joi.string().allow("", null),
    itemCode: Joi.string().allow("", null),

    barcode: Joi.string().allow("", null).required(),

    unitPrimary: Joi.string().required(),
    unitSecondary: Joi.string().allow("", null),
    conversionFactor: Joi.number().min(1).required(),

    tax: Joi.number().min(0).required(),

    hasBatch: Joi.boolean().optional(),
    hasSerial: Joi.boolean().optional(),

    purchaseRate: Joi.number().min(0).required(),
    retailRate: Joi.number().min(0).required(),
    wholesaleRate: Joi.number().min(0).required(),

    discountAmount: Joi.number().min(0).allow(0),
    discountType: Joi.string()
      .valid(...discountTypeOptions)
      .optional(),

    warehouse: Joi.string()
      .valid(...warehouseOptions)
      .required(),

    purchaseTaxMode: Joi.string()
      .valid(...taxModeTypes)
      .required(),
    retailTaxMode: Joi.string()
      .valid(...taxModeTypes)
      .required(),
    wholesaleTaxMode: Joi.string()
      .valid(...taxModeTypes)
      .required(),
    goodsOrServices: Joi.string()
      .valid(...goodsOrServices)
      .required(),
    openingStockEnabled: Joi.boolean().optional(),
    stockQty: Joi.number().integer().min(0).optional(),

    image: Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().required(),
    }).allow(null),

    isActive: Joi.boolean().optional(),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

const updateProductSchema = Joi.object({
  body: Joi.object({
    itemGroup: Joi.string().hex().length(24),

    name: Joi.string().min(2).max(100),
    hsn: Joi.string().allow("", null),
    itemCode: Joi.string().allow("", null),

    barcode: Joi.string().allow("", null).required(),

    unitPrimary: Joi.string(),
    unitSecondary: Joi.string().allow("", null),
    conversionFactor: Joi.number().min(1),

    tax: Joi.number().min(0),

    hasBatch: Joi.boolean(),
    hasSerial: Joi.boolean(),

    purchaseRate: Joi.number().min(0),
    retailRate: Joi.number().min(0),
    wholesaleRate: Joi.number().min(0),

    discountAmount: Joi.number().min(0),
    discountType: Joi.string()
      .valid(...discountTypeOptions)
      .optional(),

    warehouse: Joi.string().valid(...warehouseOptions),

    purchaseTaxMode: Joi.string()
      .valid(...taxModeTypes)
      .required(),
    retailTaxMode: Joi.string()
      .valid(...taxModeTypes)
      .required(),
    wholesaleTaxMode: Joi.string()
      .valid(...taxModeTypes)
      .required(),

    goodsOrServices: Joi.string()
      .valid(...goodsOrServices)
      .required(),

    openingStockEnabled: Joi.boolean(),
    stockQty: Joi.number().integer().min(0),

    image: Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().required(),
    }).allow(null),

    isActive: Joi.boolean(),
  }),

  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),

  query: Joi.object({}),
});

const listProductSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().allow("", null),
    isActive: Joi.boolean().optional(),
  }),
});

const listProductInfiniteSchema = Joi.object({
  body: Joi.object({}).unknown(true),
  params: Joi.object({}).unknown(true),
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(20),
    categoryId: Joi.string().allow("").optional(),
    cursor: Joi.string().optional(),
    search: Joi.string().allow("").optional(),
  }).unknown(false),
});

const barcodeParamSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    barcode: Joi.string().required(),
  }),
  query: Joi.object({}),
});

const getProductByIdSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object({}),
});

export {
  createProductSchema,
  updateProductSchema,
  listProductSchema,
  barcodeParamSchema,
  getProductByIdSchema,
  listProductInfiniteSchema,
};
