import { Document } from "mongoose";
export interface ISubscriptionUsage extends Document {
    subscription: mongodbId;
    user: mongodbId;
    complaint: mongodbId;
    serviceIndex: number;
    usedAt: Date;
}
export declare const SubscriptionUsageModel: import("mongoose").Model<ISubscriptionUsage, {}, {}, {}, Document<unknown, {}, ISubscriptionUsage, {}, {}> & ISubscriptionUsage & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=SubscriptionUsage.schema.d.ts.map