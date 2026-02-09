// routes/upload.route.ts
import * as express from "express";
import * as multer from "multer";
import * as uploadController from "../controllers/upload.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

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

export default router;
