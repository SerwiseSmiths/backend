import { Router } from "express";
import paymentController from "../controllers/payment.contoller";
import { auth } from "../middlewares/auth.middleware"; // Ensure auth is used

const router = Router();

router.post("/create-order", auth, paymentController.createPayment);
router.post("/verify", auth, paymentController.verifyPayment);

export default router;
