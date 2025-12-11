/**
 * @file subscription.service.ts
 * @description Business logic for Subscription Management
 */
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { ISubscription } from "../models/schema/subscription.schema";
/** CREATE SUBSCRIPTION */
export declare function createSubscription(userId: mongodbId, body: {
    remaining_service: number;
    payment_remaining: number;
    auto_renew: boolean;
}): Promise<ApiSuccess<ISubscription>>;
/** GET BY ID */
export declare function retrieveSubscriptionById(_id: mongodbId): Promise<ApiSuccess<ISubscription>>;
/** GET ALL */
export declare function retrieveAllSubscriptions(): Promise<ApiSuccess<ISubscription[]>>;
/** CHANGE STATE */
export declare function changeState(_id: mongodbId, newState: ISubscription["state"]): Promise<ApiSuccess<ISubscription>>;
/** UPDATE PAYMENT REMAINING */
export declare function updatePaymentRemaining(_id: mongodbId, amount: number): Promise<ApiSuccess<ISubscription>>;
//# sourceMappingURL=subscription.service.d.ts.map