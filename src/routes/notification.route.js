"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authOptional_middleware_1 = require("../middlewares/authOptional.middleware");
const router = (0, express_1.Router)();
// authOptional: populates req.user if token is present, but does NOT block if no token.
// This allows device registration to work at login AND on app reopen without re-auth.
router.post("/device/register", authOptional_middleware_1.authOptional, controller.registerDevice);
router.get("/my-notifications", auth_middleware_1.auth, controller.getMyNotifications);
router.patch("/:id/read", auth_middleware_1.auth, controller.markAsRead);
// Test Route - No auth required
router.get("/test/provider", controller.testProviderNotification);
// Admin Routes
router.post("/send", controller.sendNotification);
exports.default = router;
//# sourceMappingURL=notification.route.js.map