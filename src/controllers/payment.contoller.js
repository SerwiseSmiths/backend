"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_service_1 = require("../services/payment.service");
const verifySignature_util_1 = require("../utils/verifySignature.util");
class PaymentController {
    async createPayment(req, res) {
        const { userId, amount, type } = req.body;
        const order = await payment_service_1.default.createOrder({
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
    async webhook(req, res) {
        const signature = req.headers["x-webhook-signature"];
        if (!(0, verifySignature_util_1.verifySignature)(signature, req.body)) {
            return res.status(400).json({ message: "Invalid signature" });
        }
        const { order_id, event, ...others } = req.body;
        let status = "PENDING";
        if (event === "order.paid")
            status = "SUCCESS";
        if (event === "order.failed")
            status = "FAILED";
        await payment_service_1.default.updateTransactionStatus(order_id, status, others);
        return res.json({ message: "Webhook processed" });
    }
}
// export const myfunction = () => {
//   console.log("this  is my function")
// }
exports.default = new PaymentController();
//# sourceMappingURL=payment.contoller.js.map