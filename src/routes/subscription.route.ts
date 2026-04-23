import { Router } from "express";
const router: Router = Router();
import * as subController from "../controllers/subscription.contoller";
import { auth } from "../middlewares/auth.middleware";

// Purchase subscription
router.post("/purchase", auth, subController.purchaseSubscription);

// Get My Subscriptions
router.get("/my", auth, subController.getMySubscriptions);

// Validate Subscription (for usage check)
router.get("/validate/:userSubscriptionId", auth, subController.validateSubscription);

// Get Specific Subscription
router.get("/charge/:userSubscriptionId", auth, subController.getComplaintCharge);

// Get Specific Subscription
router.get("/:id", auth, subController.getSubscriptionById);

export default router;
