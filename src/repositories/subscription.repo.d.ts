import { IUserSubscription } from "../models/schema/UserSubscription.schema";
/** Create Subscription */
export declare const createSubscription: (data: Partial<IUserSubscription>) => Promise<IUserSubscription | null>;
/** Retrieve by ID */
export declare const retrieveSubscriptionById: (_id: mongodbId) => Promise<IUserSubscription | null>;
/** Retrieve all */
export declare const retrieveAllSubscriptions: () => Promise<IUserSubscription[]>;
/** Update partial fields */
export declare const updateSubscription: (_id: mongodbId, update: Partial<IUserSubscription>) => Promise<IUserSubscription | null>;
//# sourceMappingURL=subscription.repo.d.ts.map