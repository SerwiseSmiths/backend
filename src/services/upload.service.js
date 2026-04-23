"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileFile = exports.uploadMultipleFiles = exports.uploadSingleFile = void 0;
const fs = require("fs");
const upload_util_1 = require("../utils/upload.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const MAX_FILES = 10;
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const uploadSingleFile = async (req) => {
    const file = req.file;
    if (!file) {
        throw new ApiError_api_util_1.default(400, "No file uploaded");
    }
    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        fs.unlinkSync(file.path);
        throw new ApiError_api_util_1.default(400, `File type ${file.mimetype} is not allowed`);
    }
    try {
        // Upload to Cloudinary
        const result = await (0, upload_util_1.uploadToCloudinary)(file.path, "servicesmith");
        // Remove temp file
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        const uploadedFile = {
            publicUrl: result.secure_url,
            publicId: result.public_id,
            type: file.mimetype,
            size: result.bytes,
            originalName: file.originalname,
            format: result.format,
            width: result.width,
            height: result.height,
        };
        return new ApiSuccess_api_util_1.default(200, "File uploaded successfully", {
            file: uploadedFile,
        });
    }
    catch (error) {
        // Clean up temp file on error
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw new ApiError_api_util_1.default(500, "Failed to upload file to cloud storage");
    }
};
exports.uploadSingleFile = uploadSingleFile;
const uploadMultipleFiles = async (req) => {
    const files = req.files;
    if (!files || files.length === 0) {
        throw new ApiError_api_util_1.default(400, "No files uploaded");
    }
    if (files.length > MAX_FILES) {
        // Clean up all temp files
        files.forEach((file) => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        throw new ApiError_api_util_1.default(400, `Maximum ${MAX_FILES} files allowed`);
    }
    const uploadedFiles = [];
    const errors = [];
    for (const file of files) {
        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            errors.push(`File ${file.originalname}: type ${file.mimetype} not allowed`);
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            continue;
        }
        try {
            const result = await (0, upload_util_1.uploadToCloudinary)(file.path, "servicesmith");
            uploadedFiles.push({
                publicUrl: result.secure_url,
                publicId: result.public_id,
                type: file.mimetype,
                size: result.bytes,
                originalName: file.originalname,
                format: result.format,
                width: result.width,
                height: result.height,
            });
            // Remove temp file
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
        catch (error) {
            errors.push(`File ${file.originalname}: upload failed`);
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
    }
    if (uploadedFiles.length === 0) {
        throw new ApiError_api_util_1.default(400, "All file uploads failed", { errors });
    }
    return new ApiSuccess_api_util_1.default(200, "Files uploaded successfully", {
        files: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined,
    });
};
exports.uploadMultipleFiles = uploadMultipleFiles;
const uploadProfileFile = async (req) => {
    const file = req.file;
    if (!file) {
        throw new ApiError_api_util_1.default(400, "No file uploaded");
    }
    // Only allow image types for profile pictures
    const ALLOWED_IMAGE_TYPES = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
    ];
    // Validate MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        fs.unlinkSync(file.path);
        throw new ApiError_api_util_1.default(400, `File type ${file.mimetype} is not allowed. Only images are allowed for profile pictures.`);
    }
    try {
        // Upload to Cloudinary in profiles folder
        const result = await (0, upload_util_1.uploadToCloudinary)(file.path, "profiles");
        // Remove temp file
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        // Return URL in format expected by frontend: data.data.url or data.url
        return new ApiSuccess_api_util_1.default(200, "Profile picture uploaded successfully", {
            url: result.secure_url,
            publicId: result.public_id,
        });
    }
    catch (error) {
        // Clean up temp file on error
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw new ApiError_api_util_1.default(500, "Failed to upload profile picture to cloud storage");
    }
};
exports.uploadProfileFile = uploadProfileFile;
//# sourceMappingURL=upload.service.js.map