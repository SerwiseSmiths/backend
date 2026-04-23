import { Document } from "mongoose";
export interface ISubscriptionPayment extends Document {
    subscription: mongodbId;
    user: mongodbId;
    amount: number;
    paymentType: "upfront" | "metered_emi" | "metered_completion";
    transactionRef: string;
    status: "pending" | "completed" | "failed";
    paidAt: Date;
}
export declare const SubscriptionPaymentModel: import("mongoose").Model<ISubscriptionPayment, {}, {}, {}, Document<unknown, {}, ISubscriptionPayment, {}, {}> & ISubscriptionPayment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=SubscriptionPayment.schema.d.ts.map