"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfile = exports.uploadMultiple = exports.uploadSingle = void 0;
const uploadService = require("../services/upload.service");
const uploadSingle = async (req, res, next) => {
    try {
        const result = await uploadService.uploadSingleFile(req);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.uploadSingle = uploadSingle;
const uploadMultiple = async (req, res, next) => {
    try {
        const result = await uploadService.uploadMultipleFiles(req);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.uploadMultiple = uploadMultiple;
const uploadProfile = async (req, res, next) => {
    try {
        const result = await uploadService.uploadProfileFile(req);
        res.status(result.statusCode).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.uploadProfile = uploadProfile;
//# sourceMappingURL=upload.controller.js.map