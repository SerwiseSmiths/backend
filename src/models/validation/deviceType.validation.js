"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceTypeValidationSchema = void 0;
const Joi = require("joi");
exports.deviceTypeValidationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().allow("").optional(),
    is_deleted: Joi.boolean().optional(),
});
//# sourceMappingURL=deviceType.validation.js.map