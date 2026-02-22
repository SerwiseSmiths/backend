"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressValidationSchema = void 0;
const Joi = require("joi");
exports.addressValidationSchema = Joi.object({
    user: Joi.string().required(),
    title: Joi.string().max(255).required(),
    house_no: Joi.string().max(50).required(),
    society_name: Joi.string().max(100).required(),
    address_line_one: Joi.string().max(255).optional(),
    address_line_two: Joi.string().max(255).allow(null, "").optional(),
    area: Joi.string().max(100).optional(),
    pin_code: Joi.string().length(6).required(),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(100).optional(),
    country: Joi.string().max(100).optional().default("India"),
    latitude: Joi.string().allow(null, "").optional(),
    longitude: Joi.string().allow(null, "").optional(),
});
//# sourceMappingURL=address.validation.js.map