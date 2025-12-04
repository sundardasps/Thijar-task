import Joi from "joi";

export const uploadImageSchema = Joi.object({}).unknown(true);

export const deleteImageSchema = Joi.object({
  body: Joi.object({
    publicId: Joi.string().required().messages({
      "string.base": "publicId must be a valid string.",
      "any.required": "publicId is required for deletion.",
    }),
  }),
});
