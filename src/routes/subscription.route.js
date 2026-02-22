"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const subController = require("../controllers/subscription.contoller");
// Create subscription
router.post("/", subController.createSubscription);
// Get All
router.get("/", subController.getAllSubscriptions);
// Get By ID
router.get("/:id", subController.getSubscriptionById);
// Change State
router.patch("/:id/state", subController.updateState);
// Update Payment Remaining
router.patch("/:id/payment", subController.updatePaymentRemaining);
exports.default = router;
//# sourceMappingURL=subscription.route.js.map