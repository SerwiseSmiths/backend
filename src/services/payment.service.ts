import Cashfree from "../config/cashfree.config";
import Transaction from "../models/schema/Transection.schema";

class PaymentService {
  async createOrder(data: {
    amount: number;
    userId: string;
    type: "subscription" | "regular";
  }) {
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

    const response = await Cashfree.PGCreateOrder(orderPayload);

    console.log("Cashfree Create Order Response:", response);

    await Transaction.create({
      orderId,
      userId: data.userId,
      amount: data.amount,
      paymentType: data.type,
      status: "PENDING",
      meta: orderPayload,
    });

    return { orderId, paymentSessionId: response.data.payment_session_id };
  }

  async updateTransactionStatus(orderId: string, status: string, meta: any) {
    return Transaction.findOneAndUpdate(
      { orderId },
      { status, meta },
      { new: true }
    );
  }
}

export default new PaymentService();
