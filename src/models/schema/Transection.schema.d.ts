import { Document } from "mongoose";
export interface ITransaction extends Document {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    subscriptionId?: string;
    complaintId?: string;
    paymentType: "subscription" | "complaint" | "wallet_recharge" | "order_payment";
    status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
    meta: any;
    createdAt: Date;
}
declare const _default: import("mongoose").Model<ITransaction, {}, {}, {}, Document<unknown, {}, ITransaction, {}, {}> & ITransaction & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Transection.schema.d.ts.map