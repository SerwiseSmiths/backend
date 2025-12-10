import * as Joi from "joi";

export const serviceValidationSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  title: Joi.string().required(),
});
