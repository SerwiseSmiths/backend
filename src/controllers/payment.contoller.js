"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_service_1 = require("../services/payment.service");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
class PaymentController {
    // 1. Create Order
    async createPayment(req, res, next) {
        try {
            const { amount, type, subscriptionId, complaintId } = req.body;
            const userId = req.user?._id || req.user?.id; // Authed User
            if (!userId)
                throw new ApiError_api_util_1.default(401, "Unauthorized");
            const order = await payment_service_1.default.createOrder({
                amount,
                userId,
                type, // 'wallet_recharge', 'order_payment', 'subscription', 'complaint'
                subscriptionId,
                complaintId,
            });
            res.status(200).json(new ApiSuccess_api_util_1.default(200, "Order created successfully", order));
        }
        catch (error) {
            next(error);
        }
    }
    // 2. Verify Payment (Called from Frontend after success)
    async verifyPayment(req, res, next) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const result = await payment_service_1.default.handlePaymentSuccess(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            res.status(200).json(new ApiSuccess_api_util_1.default(200, "Payment verified successfully", result));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new PaymentController();
//# sourceMappingURL=payment.contoller.js.map