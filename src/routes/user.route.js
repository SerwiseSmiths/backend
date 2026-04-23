"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const userContoller = require("../controllers/user.controller");
const cloudinaryUpload_middleware_1 = require("../middlewares/cloudinaryUpload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
router.post("/", cloudinaryUpload_middleware_1.cloudinaryUploadMiddleware, userContoller.registerUser);
router.get("/", userContoller.getAllUsers);
router.get("/refCode/:refCode/verify", userContoller.validateRefCode);
// -----------------------------------------------
// Provider Whitelist Management
// -----------------------------------------------
router.post("/provider", auth_middleware_1.auth, userContoller.createProvider);
router.get("/provider", auth_middleware_1.auth, userContoller.getProviders);
router.patch("/provider/:id/status", auth_middleware_1.auth, userContoller.toggleProviderStatus);
exports.default = router;
//# sourceMappingURL=user.route.js.map