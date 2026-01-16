import { Request, Response, NextFunction } from "express";
import paymentService from "../services/payment.service";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import ApiError from "../utils/api/ApiError.api.util";

class PaymentController {

  // 1. Create Order
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, type, subscriptionId, complaintId } = req.body;
      const userId = (req as any).user?._id || (req as any).user?.id; // Authed User

      if (!userId) throw new ApiError(401, "Unauthorized");

      const order = await paymentService.createOrder({
        amount,
        userId,
        type, // 'wallet_recharge', 'order_payment', 'subscription', 'complaint'
        subscriptionId,
        complaintId,
      });

      res.status(200).json(new ApiSuccess(200, "Order created successfully", order));
    } catch (error) {
      next(error);
    }
  }

  // 2. Verify Payment (Called from Frontend after success)
  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const result = await paymentService.handlePaymentSuccess(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      res.status(200).json(new ApiSuccess(200, "Payment verified successfully", result));
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
