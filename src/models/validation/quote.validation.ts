import * as Joi from "joi";

export const quoteValidationSchema = Joi.object({
  items: Joi.array().items(Joi.number().integer()).optional().default([]), // Strapi part IDs are numbers
  total: Joi.number().required(), // total is required
  isPaid: Joi.boolean().optional(),
});
