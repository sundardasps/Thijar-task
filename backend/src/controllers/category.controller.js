import Category from "../models/category.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from "../utils/constants.js";

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.json(new ApiResponse(200, category));
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const exists = await Category.findOne({ name });
  if (exists) {
    throw new ApiError(400, "Category name already exists");
  }

  const category = await Category.create({ name: name.trim() });

  res.status(201).json(new ApiResponse(201, category, "Category created"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (name) category.name = name;

  await category.save();

  res.json(new ApiResponse(200, category, "Category updated"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await category.deleteOne();
  res.json(new ApiResponse(200, null, "Category deleted"));
});

export const listCategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || DEFAULT_PAGE;
  let limit = Number(req.query.limit) || DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Category.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Category.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json(
    new ApiResponse(
      200,
      {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
        },
      },
      "Categories fetched"
    )
  );
});
