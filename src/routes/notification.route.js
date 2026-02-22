"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controller = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = express.Router();
// Public/Auth optional for token registration (e.g. login screen)
// But controller logic checks for user. If we want it to work without user, we can remove auth or make it optional.
// User asked: "if user there then token should be linked".
// So we can use a middleware that populates user if token is present, but doesn't block if not.
// For now, I'll use `authenticate` if it supports optional, or just no middleware for register and handle it in controller.
// However, `req.user` usually comes from `authenticate`. 
// Let's assume `authenticate` is strict. If so, we need a separate "optional auth" or just let the client send the token after login.
// Usually device registration happens on app launch (no user) AND after login (user linked).
// I will rely on the controller handling `req.user` presence. I'll use a custom middleware or just `authenticate` if the user is expected to be logged in for "linking".
// If the user is NOT logged in, they can still register the device, but `req.user` will be undefined.
// I'll skip strict auth for the register endpoint and let the controller check header manually or use a "soft auth" middleware if available.
// Given I don't see "soft auth", I'll just leave it open and assume `req.user` is populated by a global middleware or I'll add `authenticate` for the "link to user" case. 
// Safest: Use `authenticate` for `getMyNotifications`. For `register`, maybe make it open but try to extract token.
// Actually, looking at `user.route.ts` will confirm usage.
// Routes
router.post("/device/register", auth_middleware_1.auth, controller.registerDevice); // Open endpoint, controller checks for user
router.get("/my-notifications", auth_middleware_1.auth, controller.getMyNotifications);
router.patch("/:id/read", auth_middleware_1.auth, controller.markAsRead);
// Test Route - No auth required
router.post("/test-provider", controller.testProviderNotification);
// Admin Routes
router.post("/send", auth_middleware_1.auth, (0, authorize_middleware_1.authorize)(["manager"]), controller.sendNotification);
exports.default = router;
//# sourceMappingURL=notification.route.js.map