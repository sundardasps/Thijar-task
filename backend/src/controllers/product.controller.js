import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// --------------------- CREATE PRODUCT ---------------------
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    barcode,
    itemGroup,
    price,
    purchasePrice,
    stockQty,
    unit,
    taxPercent,
    brand,
    isActive,
    unitPrimary,
    conversionFactor,
    tax,
    purchaseRate,
    retailRate,
    wholesaleRate,
    warehouse,
    purchaseTaxMode,
    retailTaxMode,
    wholesaleTaxMode,
    goodsOrServices,
    image,
  } = req.body;

  // Unique barcode check
  if (barcode) {
    const exists = await Product.findOne({ barcode });
    if (exists) throw new ApiError(400, "Barcode already exists");
  }

  const product = await Product.create({
    name,
    barcode,
    itemGroup,
    price,
    purchasePrice,
    stockQty,
    unit,
    taxPercent,
    brand,
    isActive,
    unitPrimary,
    conversionFactor,
    tax,
    purchaseRate,
    retailRate,
    wholesaleRate,
    warehouse,
    purchaseTaxMode,
    retailTaxMode,
    wholesaleTaxMode,
    goodsOrServices,
    image,
  });

  res.status(201).json(new ApiResponse(201, product, "Product created"));
});

// --------------------- UPDATE PRODUCT ---------------------
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Barcode unique validation
  if (updates.barcode) {
    const exists = await Product.findOne({
      barcode: updates.barcode,
      _id: { $ne: id },
    });
    if (exists) throw new ApiError(400, "Barcode already exists");
  }

  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new ApiError(404, "Product not found");

  res.json(new ApiResponse(200, product, "Product updated"));
});

// --------------------- DELETE PRODUCT ---------------------
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  await product.deleteOne();

  res.json(new ApiResponse(200, null, "Product deleted"));
});

// --------------------- GET BY ID ---------------------
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate("itemGroup");
  if (!product) throw new ApiError(404, "Product not found");

  res.json(new ApiResponse(200, product, "Product fetched"));
});

// --------------------- GET ALL WITH FILTERS ---------------------
export const getProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const search = req.query.search || "";

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { barcode: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Product.countDocuments(filter);

  const items = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return res.json(
    new ApiResponse(200, {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  );
});

// --------------------- BARCODE SEARCH (POS Fast Scan) ---------------------
export const getProductByBarcode = asyncHandler(async (req, res) => {
  const { barcode } = req.params;

  const product = await Product.findOne({ barcode }).populate("itemGroup");
  if (!product) throw new ApiError(404, "Product not found");

  res.json(new ApiResponse(200, product, "Product fetched by barcode"));
});

export const getProductsInfinite = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const categoryId = req.query.categoryId;
  const cursor = req.query.cursor;
  const search = req.query.search || "";

  const filter = {};

  // Category filter
  if (categoryId) {
    filter.itemGroup = categoryId;
  }

  if (search.trim() !== "") {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { barcode: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  if (cursor) {
    filter._id = { $lt: cursor };
  }

  const items = await Product.find(filter)
    .sort({ _id: -1 })
    .limit(limit);

  const nextCursor = items.length ? items[items.length - 1]._id : null;

  return res.json(
    new ApiResponse(200, {
      items,
      nextCursor,
      hasMore: !!nextCursor,
    })
  );
});

