import { Router } from "express";
const router: Router = Router();

import * as userContoller from "../controllers/user.controller";
import { cloudinaryUploadMiddleware } from "../middlewares/cloudinaryUpload.middleware";
import { auth } from "../middlewares/auth.middleware";

router.post("/", cloudinaryUploadMiddleware, userContoller.registerUser);
router.get("/", userContoller.getAllUsers);
router.get("/refCode/:refCode/verify", userContoller.validateRefCode);

// -----------------------------------------------
// Provider Whitelist Management
// -----------------------------------------------
router.post("/provider", auth, userContoller.createProvider);
router.get("/provider", auth, userContoller.getProviders);
router.patch("/provider/:id/status", auth, userContoller.toggleProviderStatus);

export default router;