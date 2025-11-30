import * as Joi from "joi";

export const deviceTypeValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().allow("").optional(),
  is_deleted: Joi.boolean().optional(),
});
