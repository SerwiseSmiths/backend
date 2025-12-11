"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const Joi = require("joi");
const user_constant_1 = require("../../constants/user.constant"); // adjust import path
exports.userValidationSchema = Joi.object({
    phoneNo: Joi.string()
        .trim()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must be 10–15 digits",
    }),
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .optional()
        .allow(null, "")
        .messages({
        "string.email": "Invalid email format",
    }),
    profileImage: Joi.string()
        .optional(),
    firstName: Joi.string().trim().required().messages({
        "string.empty": "First name is required",
    }),
    middleName: Joi.string().trim().optional().allow(null, ""),
    lastName: Joi.string().trim().required().messages({
        "string.empty": "Last name is required",
    }),
    userType: Joi.string()
        .valid(...Object.values(user_constant_1.UserType))
        .default(user_constant_1.UserType.CUSTOMER),
    source: Joi.string().required(),
});
//# sourceMappingURL=user.validation.js.map