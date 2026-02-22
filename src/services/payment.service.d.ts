declare class PaymentService {
    private razorpay;
    constructor();
    createOrder(data: {
        amount: number;
        userId: string;
        type: "wallet_recharge" | "order_payment" | "subscription" | "complaint";
        subscriptionId?: string;
        complaintId?: string;
    }): Promise<import("razorpay/dist/types/orders").Orders.RazorpayOrder>;
    verifyPaymentSignature(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean;
    handlePaymentSuccess(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        message: string;
        transaction: import("mongoose").Document<unknown, {}, import("../models/schema/Transection.schema").ITransaction, {}, {}> & import("../models/schema/Transection.schema").ITransaction & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=payment.service.d.ts.map