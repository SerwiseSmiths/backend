"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cashfree_config_1 = require("../config/cashfree.config");
const Transection_schema_1 = require("../models/schema/Transection.schema");
class PaymentService {
    async createOrder(data) {
        const orderId = "ORD_" + Date.now();
        const orderPayload = {
            order_id: orderId,
            order_amount: data.amount,
            order_currency: "INR",
            customer_details: {
                customer_id: data.userId,
                customer_phone: "9999999999",
                customer_email: "user@mail.com",
            },
        };
        const response = await cashfree_config_1.default.PGCreateOrder(orderPayload);
        console.log("Cashfree Create Order Response:", response);
        await Transection_schema_1.default.create({
            orderId,
            userId: data.userId,
            amount: data.amount,
            paymentType: data.type,
            status: "PENDING",
            meta: orderPayload,
        });
        return { orderId, paymentSessionId: response.data.payment_session_id };
    }
    async updateTransactionStatus(orderId, status, meta) {
        return Transection_schema_1.default.findOneAndUpdate({ orderId }, { status, meta }, { new: true });
    }
}
exports.default = new PaymentService();
//# sourceMappingURL=payment.service.js.map