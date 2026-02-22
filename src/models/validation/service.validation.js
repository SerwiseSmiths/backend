"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceValidationSchema = void 0;
const Joi = require("joi");
exports.serviceValidationSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    title: Joi.string().required(),
});
//# sourceMappingURL=service.validation.js.map