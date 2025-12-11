"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.route.ts
const express = require("express");
const router = express.Router();
const userContoller = require("../controllers/user.controller");
const cloudinaryUpload_middleware_1 = require("../middlewares/cloudinaryUpload.middleware");
router.post("/", cloudinaryUpload_middleware_1.cloudinaryUploadMiddleware, userContoller.registerUser);
router.get("/", userContoller.getAllUsers);
router.get("/refCode/:refCode/verify", userContoller.validateRefCode);
exports.default = router;
//# sourceMappingURL=user.route.js.map