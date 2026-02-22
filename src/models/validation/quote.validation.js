"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteValidationSchema = void 0;
const Joi = require("joi");
exports.quoteValidationSchema = Joi.object({
    items: Joi.array().items(Joi.number().integer()).optional().default([]), // Strapi part IDs are numbers
    total: Joi.number().required(), // total is required
    isPaid: Joi.boolean().optional(),
});
//# sourceMappingURL=quote.validation.js.map