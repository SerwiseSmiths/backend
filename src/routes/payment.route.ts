import { Router } from "express";
import paymentController from "../controllers/payment.contoller";

const router = Router();

router.post("/create-order", paymentController.createPayment);
router.post("/webhook", paymentController.webhook); // Cashfree → Server

export default router;
