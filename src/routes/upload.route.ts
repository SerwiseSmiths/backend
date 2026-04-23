// routes/upload.route.ts
import { Router } from "express";
import multer = require("multer");
import * as uploadController from "../controllers/upload.controller";
import { auth } from "../middlewares/auth.middleware";

const router: Router = Router();

// Multer setup for temporary storage
const upload = multer({ dest: "uploads/" });

/**
 * @route POST /api/v2/upload/single
 * @desc Upload a single file to Cloudinary
 * @access Private
 */
router.post(
    "/single",
    auth,
    upload.single("file"),
    uploadController.uploadSingle
);

/**
 * @route POST /api/v2/upload/multiple
 * @desc Upload multiple files to Cloudinary (max 10)
 * @access Private
 */
router.post(
    "/multiple",
    auth,
    upload.array("files", 10),
    uploadController.uploadMultiple
);

/**
 * @route POST /api/v2/upload/profile
 * @desc Upload a profile picture to Cloudinary
 * @access Private
 */
router.post(
    "/profile",
    auth,
    upload.single("file"),
    uploadController.uploadProfile
);

export default router;
