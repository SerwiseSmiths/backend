declare class PaymentService {
    createOrder(data: {
        amount: number;
        userId: string;
        type: "subscription" | "regular";
    }): Promise<{
        orderId: string;
        paymentSessionId: string | undefined;
    }>;
    updateTransactionStatus(orderId: string, status: string, meta: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/schema/Transection.schema").ITransaction, {}, {}> & import("../models/schema/Transection.schema").ITransaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=payment.service.d.ts.map