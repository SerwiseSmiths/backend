"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUploadMiddleware = void 0;
const multer = require("multer");
const fs = require("fs");
const upload_util_1 = require("../utils/upload.util");
// temporary storage
const upload = multer({ dest: "uploads/" });
exports.cloudinaryUploadMiddleware = [
    upload.single("file"),
    async (req, res, next) => {
        try {
            console.log(req);
            console.log("File received:", req.file);
            let result;
            if (!req.file) {
                // result = {
                //   secure_url:"url",
                //   public_id:"id",
                //   }
            }
            // return res.status(400).json({ message: "No file uploaded" });}
            else {
                // Upload to Cloudinary
                result = await (0, upload_util_1.uploadToCloudinary)(req.file.path, "myApp");
                // remove temp file after upload
                fs.unlinkSync(req.file.path);
            }
            // attach cloudinary response to req
            req.cloudinary = {
                url: result.secure_url,
                publicId: result.public_id,
            };
            next();
        }
        catch (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({ message: "File upload failed" });
        }
    }
];
//# sourceMappingURL=cloudinaryUpload.middleware.js.map