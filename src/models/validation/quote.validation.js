"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteValidationSchema = void 0;
const Joi = require("joi");
exports.quoteValidationSchema = Joi.object({
    items: Joi.array().items(Joi.string().hex().length(24)).required(),
    total: Joi.number().optional(), // auto-calculated
    isPaid: Joi.boolean().optional(),
});
//# sourceMappingURL=quote.validation.js.map