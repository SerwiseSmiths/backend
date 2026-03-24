import * as Joi from "joi";

export const quoteValidationSchema = Joi.object({
  // Accept both numbers or strings for part IDs to avoid "must be a number" errors
  items: Joi.array().items(Joi.any()).optional().default([]),
  total: Joi.number().required(), // total is required
  isPaid: Joi.boolean().optional(),
  status: Joi.string().valid("PENDING", "APPROVED", "REJECTED").optional(),
});
