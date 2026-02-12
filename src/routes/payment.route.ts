import { Router } from "express";
import paymentController from "../controllers/payment.contoller";
import * as paymentVerificationController from "../controllers/payment.controller";
import { auth } from "../middlewares/auth.middleware"; // Ensure auth is used

const router = Router();

// Existing Razorpay payment routes
router.post("/create-order", auth, paymentController.createPayment);
router.post("/verify", auth, paymentController.verifyPayment);

// New: Payment verification for complaints (admin email verification)
router.post("/request-verification", auth, paymentVerificationController.requestPaymentVerification);
router.get("/verify/:token", paymentVerificationController.verifyPayment);
router.get("/reject/:token", paymentVerificationController.rejectPayment);

export default router;
