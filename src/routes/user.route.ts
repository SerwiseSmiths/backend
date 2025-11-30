// routes/user.route.ts
import * as express from "express";
const router: express.Router = express.Router();

import * as userContoller from "../controllers/user.controller";
import { uploadToCloudinary } from "../utils/upload.util";
import { cloudinaryUploadMiddleware } from "../middlewares/cloudinaryUpload.middleware";

router.post("/", cloudinaryUploadMiddleware, userContoller.registerUser);
router.get("/refCode/:refCode/verify", userContoller.validateRefCode);

export default router;