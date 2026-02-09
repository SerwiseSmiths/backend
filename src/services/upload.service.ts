// services/upload.service.ts
import { Request } from "express";
import * as fs from "fs";
import { uploadToCloudinary } from "../utils/upload.util";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { IUploadedFile } from "../types/upload.type";

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

export const uploadSingleFile = async (req: Request) => {
    const file = (req as any).file;

    if (!file) {
        throw new ApiError(400, "No file uploaded");
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        fs.unlinkSync(file.path);
        throw new ApiError(400, `File type ${file.mimetype} is not allowed`);
    }

    try {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(file.path, "servicesmith");

        // Remove temp file
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        const uploadedFile: IUploadedFile = {
            publicUrl: result.secure_url,
            publicId: result.public_id,
            type: file.mimetype,
            size: result.bytes,
            originalName: file.originalname,
            format: result.format,
            width: result.width,
            height: result.height,
        };

        return new ApiSuccess(200, "File uploaded successfully", {
            file: uploadedFile,
        });
    } catch (error) {
        // Clean up temp file on error
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw new ApiError(500, "Failed to upload file to cloud storage");
    }
};

export const uploadMultipleFiles = async (req: Request) => {
    const files = (req as any).files as Express.Multer.File[];

    if (!files || files.length === 0) {
        throw new ApiError(400, "No files uploaded");
    }

    if (files.length > MAX_FILES) {
        // Clean up all temp files
        files.forEach((file) => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        throw new ApiError(400, `Maximum ${MAX_FILES} files allowed`);
    }

    const uploadedFiles: IUploadedFile[] = [];
    const errors: string[] = [];

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
            const result = await uploadToCloudinary(file.path, "servicesmith");

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
        } catch (error) {
            errors.push(`File ${file.originalname}: upload failed`);
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
    }

    if (uploadedFiles.length === 0) {
        throw new ApiError(400, "All file uploads failed", { errors });
    }

    return new ApiSuccess(200, "Files uploaded successfully", {
        files: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined,
    });
};
