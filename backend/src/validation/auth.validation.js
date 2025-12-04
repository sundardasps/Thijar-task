import Joi from "joi";

const registerSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().optional().allow(null, ""),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .allow(null, ""),

    password: Joi.string().min(6).required(),

    role: Joi.string().valid("admin", "cashier").optional(),
  }).custom((value, helpers) => {
    if (!value.email && !value.phone) {
      return helpers.message("Either email or phone is required.");
    }
    return value;
  }),
});

const loginSchema = Joi.object({
  body: Joi.object({
    emailOrPhone: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

export { registerSchema, loginSchema };
