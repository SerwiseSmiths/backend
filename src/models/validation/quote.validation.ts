import * as Joi from "joi";

export const quoteValidationSchema = Joi.object({
  items: Joi.array().items(Joi.string().hex().length(24)).required(),
  total: Joi.number().optional(), // auto-calculated
  isPaid: Joi.boolean().optional(),
});
