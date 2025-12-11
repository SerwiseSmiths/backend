import { Request, Response } from "express";
import paymentService from "../services/payment.service";
import { verifySignature } from "../utils/verifySignature.util";

class PaymentController {
  async createPayment(req: Request, res: Response) {
    const { userId, amount, type } = req.body;

    const order = await paymentService.createOrder({
      amount,
      userId,
      type,
    });

    return res.json({
      success: true,
      orderId: order.orderId,
      paymentSessionId: order.paymentSessionId,
    });
  }

  async webhook(req: Request, res: Response) {
    const signature = req.headers["x-webhook-signature"] as string;

    if (!verifySignature(signature, req.body)) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const { order_id, event, ...others } = req.body;

    let status = "PENDING";
    if (event === "order.paid") status = "SUCCESS";
    if (event === "order.failed") status = "FAILED";

    await paymentService.updateTransactionStatus(order_id, status, others);

    return res.json({ message: "Webhook processed" });
  }
}

// export const myfunction = () => {
//   console.log("this  is my function")
// }

export default new PaymentController();
