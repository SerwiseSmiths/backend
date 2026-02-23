import { Router } from "express";
import * as paymentVerificationController from "../controllers/payment.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// Payment verification for complaints (admin email verification)
router.post("/request-verification", auth, paymentVerificationController.requestPaymentVerification);
router.get("/verify/:token", paymentVerificationController.verifyPayment);
router.get("/reject/:token", paymentVerificationController.rejectPayment);

// Payment calculation and QR code
router.get("/qr/:complaintId", auth, paymentVerificationController.getPaymentQRCode);
router.post("/calculate/:complaintId", auth, paymentVerificationController.calculatePayment);
router.post("/cash-collect/:complaintId", auth, paymentVerificationController.collectCashPayment);

export default router;
