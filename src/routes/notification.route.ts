import { Router } from "express";
import * as controller from "../controllers/notification.controller";
import { auth } from "../middlewares/auth.middleware";
import { authOptional } from "../middlewares/authOptional.middleware";
import { authorize } from "../middlewares/authorize.middleware";


const router: Router = Router();



// authOptional: populates req.user if token is present, but does NOT block if no token.
// This allows device registration to work at login AND on app reopen without re-auth.
router.post("/device/register", authOptional, controller.registerDevice);
router.get("/my-notifications", auth, controller.getMyNotifications);
router.patch("/:id/read", auth, controller.markAsRead);

// Test Route - No auth required
router.get("/test/provider", controller.testProviderNotification);

// Admin Routes
router.post("/send", controller.sendNotification);

export default router;
