"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/upload.route.ts
const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express.Router();
// Multer setup for temporary storage
const upload = multer({ dest: "uploads/" });
/**
 * @route POST /api/v2/upload/single
 * @desc Upload a single file to Cloudinary
 * @access Private
 */
router.post("/single", auth_middleware_1.auth, upload.single("file"), uploadController.uploadSingle);
/**
 * @route POST /api/v2/upload/multiple
 * @desc Upload multiple files to Cloudinary (max 10)
 * @access Private
 */
router.post("/multiple", auth_middleware_1.auth, upload.array("files", 10), uploadController.uploadMultiple);
/**
 * @route POST /api/v2/upload/profile
 * @desc Upload a profile picture to Cloudinary
 * @access Private
 */
router.post("/profile", auth_middleware_1.auth, upload.single("file"), uploadController.uploadProfile);
exports.default = router;
//# sourceMappingURL=upload.route.js.map