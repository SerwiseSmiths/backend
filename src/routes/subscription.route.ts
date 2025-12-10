import * as express from "express";
const router: express.Router = express.Router();

import * as subController from "../controllers/subscription.contoller";

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

export default router;
