import Joi from "joi";

const createCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(50).required(),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

const updateCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
  }),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object({}),
});

const listCategorySchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
});

export { createCategorySchema, updateCategorySchema, listCategorySchema };
