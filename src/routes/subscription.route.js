"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const subController = require("../controllers/subscription.contoller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Purchase subscription
router.post("/purchase", auth_middleware_1.auth, subController.purchaseSubscription);
// Get My Subscriptions
router.get("/my", auth_middleware_1.auth, subController.getMySubscriptions);
// Validate Subscription (for usage check)
router.get("/validate/:userSubscriptionId", auth_middleware_1.auth, subController.validateSubscription);
// Get Specific Subscription
router.get("/charge/:userSubscriptionId", auth_middleware_1.auth, subController.getComplaintCharge);
// Get Specific Subscription
router.get("/:id", auth_middleware_1.auth, subController.getSubscriptionById);
exports.default = router;
//# sourceMappingURL=subscription.route.js.map