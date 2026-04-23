import { Document } from "mongoose";
export interface IUserSubscription extends Document {
    user: mongodbId;
    plan_snapshot: {
        name: string;
        plan_type: "Basic" | "Standard" | "Addon";
        totalServices: number;
        serviceMapping: {
            usageIndex: number;
            allowedServiceId: string;
            includedParts: string[];
            providerPayout: number;
        }[];
        pricing: {
            cost: number;
            sub_sales: number;
            non_sub_sales: number;
            sub_profit: number;
            non_sub_profit: number;
        };
        maxDiscount: number;
        lockInPeriod: number;
        validityDuration: number;
    };
    addons_snapshot?: {
        name: string;
        pricing: {
            cost: number;
            sub_sales: number;
            non_sub_sales: number;
            sub_profit: number;
        };
    }[];
    startDate: Date;
    expiryDate: Date;
    status: "pending" | "scheduled" | "active" | "expired" | "cancelled";
    paymentModel: "flat" | "metered";
    paymentStatus: "pending" | "partial" | "completed";
    totalPaid: number;
    remainingAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSubscriptionModel: import("mongoose").Model<IUserSubscription, {}, {}, {}, Document<unknown, {}, IUserSubscription, {}, {}> & IUserSubscription & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserSubscription.schema.d.ts.map