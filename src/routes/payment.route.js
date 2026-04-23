"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentVerificationController = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Payment verification for complaints (admin email verification)
router.post("/request-verification", auth_middleware_1.auth, paymentVerificationController.requestPaymentVerification);
router.get("/verify/:token", paymentVerificationController.verifyPayment);
router.get("/reject/:token", paymentVerificationController.rejectPayment);
// Payment calculation and QR code
router.get("/qr/:complaintId", auth_middleware_1.auth, paymentVerificationController.getPaymentQRCode);
router.post("/calculate/:complaintId", auth_middleware_1.auth, paymentVerificationController.calculatePayment);
router.post("/cash-collect/:complaintId", auth_middleware_1.auth, paymentVerificationController.collectCashPayment);
router.post("/bypass/:complaintId", auth_middleware_1.auth, paymentVerificationController.bypassZeroPayment);
// Razorpay Webhook
router.post("/razorpay/webhook", paymentVerificationController.razorpayWebhook);
exports.default = router;
//# sourceMappingURL=payment.route.js.map