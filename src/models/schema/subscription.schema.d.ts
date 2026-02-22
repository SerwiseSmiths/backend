import { Document } from "mongoose";
export interface ISubscription extends Document {
    user: mongodbId;
    created_at: Date;
    end_at: Date;
    remaining_service: number;
    used_service: number;
    state: "active" | "expired" | "completed" | "cancelled" | "pending";
    auto_renew: boolean;
    payment_remaining: number;
    type: string;
    payments: mongodbId[];
}
export declare const SubscriptionModel: import("mongoose").Model<ISubscription, {}, {}, {}, Document<unknown, {}, ISubscription, {}, {}> & ISubscription & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=subscription.schema.d.ts.map