/**
 * @file subscription.service.ts
 * @description Business logic for Subscription Management (Rebuilt)
 */
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { IUserSubscription } from "../models/schema/UserSubscription.schema";
/** PURCHASE SUBSCRIPTION */
export declare function purchaseSubscription(userId: mongodbId, body: {
    planId: string;
    startDate: string;
    paymentModel: "flat" | "metered";
    addonIds?: string[];
}): Promise<ApiSuccess<IUserSubscription>>;
/** GET USER SUBSCRIPTIONS */
export declare function retrieveSubscriptionsByUser(userId: mongodbId): Promise<ApiSuccess<(import("mongoose").Document<unknown, {}, IUserSubscription, {}, {}> & IUserSubscription & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>>;
/** VALIDATE USAGE FOR COMPLAINT */
export declare function validateSubscriptionForComplaint(userId: mongodbId, userSubscriptionId: mongodbId): Promise<ApiSuccess<{
    subscription: import("mongoose").Document<unknown, {}, IUserSubscription, {}, {}> & IUserSubscription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    nextIndex: number;
    mapping: {
        usageIndex: number;
        allowedServiceId: string;
        includedParts: string[];
        providerPayout: number;
    } | undefined;
}>>;
/** RECORD USAGE (After service completion) */
export declare function recordUsage(subscriptionId: mongodbId, complaintId: mongodbId, serviceIndex: number): Promise<import("mongoose").Document<unknown, {}, import("../models/schema/SubscriptionUsage.schema").ISubscriptionUsage, {}, {}> & import("../models/schema/SubscriptionUsage.schema").ISubscriptionUsage & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
/** RECORD PAYMENT */
export declare function recordSubscriptionPayment(subscriptionId: mongodbId, amount: number, type: "upfront" | "metered_emi" | "metered_completion", ref: string): Promise<import("mongoose").Document<unknown, {}, import("../models/schema/SubscriptionPayment.schema").ISubscriptionPayment, {}, {}> & import("../models/schema/SubscriptionPayment.schema").ISubscriptionPayment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
/**
 * Compute how much to charge the user at complaint creation time for a metered subscription.
 *
 * Rules:
 *  - Flat plan: always ₹0 (all paid upfront)
 *  - Metered plan:
 *    - lockInPeriod = 0 → no metered option (should not reach here)
 *    - lockInServices = Math.floor((lockInPeriod / validityDuration) * totalServices)
 *    - nextUsageIndex (1-based) <= lockInServices → charge ₹200 visiting fee
 *    - nextUsageIndex > lockInServices → charge remaining subscription balance
 *      (this is the "post lock-in" charge that activates the remaining free services)
 */
export declare function getSubscriptionChargeForComplaint(userSubscriptionId: mongodbId): Promise<{
    chargeType: "none" | "visiting" | "remaining";
    amount: number;
}>;
/** GET SUBSCRIPTION BY ID */
export declare function getSubscriptionById(id: string): Promise<ApiSuccess<{
    lastServicedAt: Date | null;
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
    _id: import("mongoose").Types.ObjectId;
    $locals: Record<string, unknown>;
    $op: "save" | "validate" | "remove" | null;
    $where: Record<string, unknown>;
    baseModelName?: string;
    collection: import("mongoose").Collection;
    db: import("mongoose").Connection;
    errors?: import("mongoose").Error.ValidationError;
    id?: any;
    isNew: boolean;
    schema: import("mongoose").Schema;
    __v: number;
}>>;
//# sourceMappingURL=subscription.service.d.ts.map