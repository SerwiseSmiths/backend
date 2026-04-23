"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceValidationSchema = exports.deviceDescriptionSchema = void 0;
const Joi = require("joi");
exports.deviceDescriptionSchema = Joi.object({
    basic: Joi.object({
        spun: Joi.number().min(0).default(0),
        sediment: Joi.number().min(0).default(0),
        pre: Joi.number().min(0).default(0),
        post: Joi.number().min(0).default(0),
        UV: Joi.number().min(0).default(0),
        UF: Joi.number().min(0).default(0),
        RO: Joi.number().min(0).default(0),
        TDS: Joi.number().min(0).default(0),
        Alkaline: Joi.number().min(0).default(0),
    }).required(),
    additional: Joi.object({
        CU: Joi.number().min(0).default(0),
        zn: Joi.number().min(0).default(0),
        MG: Joi.number().min(0).default(0),
        ca: Joi.number().min(0).default(0),
        other: Joi.number().min(0).default(0),
    }).required(),
    age: Joi.number().min(0).required(),
    storageCapacity: Joi.number().min(0).required(),
    purchaseDate: Joi.string().optional(),
    location: Joi.string().required(),
});
exports.deviceValidationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    deviceType: Joi.string().required(), // Strapi ID (not MongoDB ObjectId)
    description: exports.deviceDescriptionSchema,
    user: Joi.string().length(24).required(),
    address: Joi.string().length(24).required(), // <-- updated (MongoId)
    isDeleted: Joi.boolean().optional(),
});
//# sourceMappingURL=device.validation.js.map