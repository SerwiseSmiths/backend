"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_config_1 = require("../config/cloudinary.config");
const uploadToCloudinary = async (filePath, folder = "uploads") => {
    return await cloudinary_config_1.default.uploader.upload(filePath, {
        folder,
        resource_type: "auto",
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
//# sourceMappingURL=upload.util.js.map